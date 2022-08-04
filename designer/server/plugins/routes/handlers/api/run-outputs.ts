import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  Condition,
  ConditionValue,
  FormDefinition,
  FreshdeskOutputConfiguration,
  NotifyOutputConfiguration,
  Output,
  S3FileUploadOutputConfiguration,
  TopdeskOutputConfiguration,
  WebhookOutputConfiguration,
} from "@xgovformbuilder/model";
import { Submission } from "designer/client/pages/Submissions/types";
import fetch from "node-fetch";

import {
  freshdesk,
  GOVNotifySendEmail,
  s3fileupload,
  topdesk,
  topdeskIncident,
  webhook,
} from "../../../../lib/outputs";
import { FileUpload } from "../../../../lib/outputs/s3fileupload";
import { getTrueSubmission, returnResponse } from "../../helpers";
import { IntegrationLog, OutputRequest } from "../../types";

interface blankObject {
  [key: string]: any;
}

export const runOutputsHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  return new Promise((resolve) => {
    try {
      if (request.payload) {
        const {
          submission,
          formScheme,
          files,
          filenames,
          fileTypes,
        } = request.payload as OutputRequest;
        let filesDecoded: FileUpload[] = [];
        if (files && filenames && fileTypes) {
          if (
            Array.isArray(files) &&
            Array.isArray(filenames) &&
            Array.isArray(fileTypes)
          ) {
            filesDecoded = files.map((file, index) => {
              return {
                filename: filenames[index],
                type: fileTypes[index],
                fileContent: file,
              };
            });
          } else {
            filesDecoded.push({
              filename: filenames as string,
              type: fileTypes as string,
              fileContent: files as Buffer,
            });
          }
        }
        let flattenedFormValues = Object.keys(submission.formValues).reduce(
          (acc, currentPage) => {
            return {
              ...acc,
              ...submission.formValues[currentPage],
            };
          },
          {}
        );
        let validOutputs = formScheme.outputs.filter((output) => {
          if (output.condition) {
            let condition = formScheme.conditions.find(
              (searchCondition) => searchCondition.name === output.condition
            );
            if (condition) {
              let conditionParts = (condition.value as any)
                .conditions as Condition[];
              let valid = true;
              conditionParts.forEach((conditionPart) => {
                if (
                  (conditionPart.operator === "is" &&
                    flattenedFormValues[
                      conditionPart.field.name.split(".")[1]
                    ] !== (conditionPart.value as ConditionValue).value) ||
                  (conditionPart.operator === "is not" &&
                    flattenedFormValues[
                      conditionPart.field.name.split(".")[1]
                    ] === (conditionPart.value as ConditionValue).value)
                ) {
                  valid = false;
                }
              });
              return valid;
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
        let outputsTree = buildOutputsTree(validOutputs);
        console.log(outputsTree);
        let outputPromises: Promise<IntegrationLog[]>[] = [];
        outputsTree.forEach(async (outputNode) => {
          outputPromises.push(
            runOutput(
              outputNode.output,
              outputNode.next,
              submission as Submission,
              formScheme,
              filesDecoded
            )
          );
        });
        Promise.all(outputPromises)
          .then((res) => {
            let integrationLogPromises: Promise<any>[] = [];
            res.forEach((response) => {
              const integrationLogs = response;
              integrationLogs.forEach((log) => {
                integrationLogPromises.push(
                  new Promise((resolve, reject) => {
                    fetch(
                      "https://6zy0ta2uxg.execute-api.eu-west-2.amazonaws.com/dev/integrations-log",
                      {
                        headers: {
                          "Content-Type": "application/json",
                          "X-API-Key": process.env.AWS_API_KEY as string,
                        },
                        method: "POST",
                        body: JSON.stringify(log),
                      }
                    )
                      .then(() => {
                        resolve("");
                      })
                      .catch((err) => reject(err));
                  })
                );
              });
            });
            let possibleSubmissionChanges = res.reduce<any[]>(
              (acc, currentOutputRes) => [
                ...acc,
                currentOutputRes
                  .filter(
                    (currentRes) =>
                      currentRes &&
                      typeof currentRes.response === "object" &&
                      currentRes.response.constructor.name === "object" &&
                      currentRes.response.submission
                  )
                  .map((currentRes) => ({
                    submission: currentRes.response.submission,
                  })),
              ],
              []
            );
            let submissionCopy = { ...submission };
            if (possibleSubmissionChanges.length > 0) {
              submissionCopy = getTrueSubmission(
                submission,
                possibleSubmissionChanges
              );
            }
            Promise.all(integrationLogPromises)
              .then(() => {
                console.log("integration logs should be done");
                resolve(
                  returnResponse(h, submissionCopy, 200, "application/json")
                );
              })
              .catch((err) => {
                console.log(err);
                resolve(
                  returnResponse(h, submissionCopy, 200, "application/json")
                );
              });
          })
          .catch((err) => {
            console.log(err);
            resolve(returnResponse(h, err.message, 500, "application/json"));
          });
      } else {
        const message = "couldn't find a payload";
        resolve(returnResponse(h, message, 400, "application/json"));
      }
    } catch (err) {
      request.logger.error(
        "Designer Server POST /api/outputs error:",
        (err as Error).message
      );
      const errorSummary = {
        payload: request.payload,
        errorMessage: (err as Error).message,
        error: (err as Error).stack,
      };
      request.yar.set(`error-summary`, errorSummary);
      const response = {
        ok: false,
        err,
      };
      resolve(returnResponse(h, response, 401, "application/json"));
    }
  });
};

const runOutput = (
  output: Output,
  nextOutputs: OutputTreeNode[],
  submission: Submission,
  formScheme: FormDefinition,
  files: FileUpload[],
  previousValues?: blankObject
): Promise<IntegrationLog[]> => {
  return new Promise((resolve, reject) => {
    let innerPromise: Promise<any>;
    let integrationLogs: IntegrationLog[] = [];
    switch (output.type) {
      case "email":
        innerPromise = new Promise<void>((resolve) => resolve());
        break;
      case "notify":
        innerPromise = GOVNotifySendEmail(
          submission,
          formScheme,
          output.outputConfiguration as NotifyOutputConfiguration,
          previousValues
        );
        integrationLogs.push({
          submissionId: submission.submissionId,
          integrationName: output.title,
          integrationType: output.type,
          configuration: output.outputConfiguration,
          request: submission.formValues,
          result: "success",
        });
        break;
      case "webhook":
        innerPromise = webhook(
          output.outputConfiguration as WebhookOutputConfiguration,
          submission.formValues
        );

        integrationLogs.push({
          submissionId: submission.submissionId,
          integrationName: output.title,
          integrationType: output.type,
          configuration: output.outputConfiguration,
          request: submission.formValues,
          result: "success",
        });
        break;
      case "freshdesk":
        innerPromise = freshdesk(
          output.outputConfiguration as FreshdeskOutputConfiguration,
          submission,
          submission.formValues
        );
        integrationLogs.push({
          submissionId: submission.submissionId,
          integrationName: output.title,
          integrationType: output.type,
          configuration: output.outputConfiguration,
          request: submission.formValues,
          result: "success",
        });
        break;
      case "s3fileupload":
        innerPromise = s3fileupload(
          output.outputConfiguration as S3FileUploadOutputConfiguration,
          submission,
          files
        );
        integrationLogs.push({
          submissionId: submission.submissionId,
          integrationName: output.title,
          integrationType: output.type,
          configuration: output.outputConfiguration,
          request: {
            submission: submission,
            files: files.map((file) => file.filename),
          },
          result: "success",
        });
        break;
      case "topdesk":
        innerPromise = topdesk(
          output.outputConfiguration as TopdeskOutputConfiguration,
          submission.formValues,
          formScheme
        );
        integrationLogs.push({
          submissionId: submission.submissionId,
          integrationName: output.title,
          integrationType: output.type,
          configuration: output.outputConfiguration,
          request: {
            submission: submission,
          },
          result: "success",
        });
        break;
      case "topdesk-incident":
        innerPromise = topdeskIncident(
          output.outputConfiguration as TopdeskOutputConfiguration,
          submission.formValues,
          formScheme,
          files
        );
        integrationLogs.push({
          submissionId: submission.submissionId,
          integrationName: output.title,
          integrationType: output.type,
          configuration: output.outputConfiguration,
          request: {
            submission: submission,
          },
          result: "success",
        });
        break;
      default:
        const message = "No output of that type found";
        innerPromise = new Promise<void>((resolve) => resolve());
        reject(message);
    }
    if (nextOutputs.length > 0) {
      innerPromise
        .then((res) => {
          integrationLogs[0].response = res;
          if (!previousValues) {
            previousValues = {
              [output.name]: res,
            };
          } else {
            previousValues[output.name] = res;
          }
          Promise.all(
            nextOutputs.map((nextOutput) =>
              runOutput(
                nextOutput.output,
                nextOutput.next,
                submission,
                formScheme,
                files,
                previousValues
              )
            )
          ).then((nextRes) => {
            nextRes.forEach((promiseRes) => {
              integrationLogs = integrationLogs.concat(promiseRes);
            });
            resolve(integrationLogs);
          });
        })
        .catch((err) => {
          integrationLogs[0].response = err;
          integrationLogs[0].result = "failure";
          console.log("There was an error", err);
          resolve(integrationLogs);
        });
    } else {
      innerPromise
        .then((res) => {
          integrationLogs[0].response = res;
          resolve(integrationLogs);
        })
        .catch((err) => {
          integrationLogs[0].response = err;
          integrationLogs[0].result = "failure";
          console.log("there was an error", err);
          resolve(integrationLogs);
        });
    }
  });
};

interface OutputTreeNode {
  output: Output;
  next: OutputTreeNode[];
}

const buildOutputsTree = (
  outputs: Output[],
  parent?: string
): OutputTreeNode[] => {
  let [topLevelOutputs, otherOutputs] = outputs.reduce<[Output[], Output[]]>(
    (acc, currentOutput) => {
      if (
        (parent && currentOutput.previous !== parent) ||
        (!parent && currentOutput.previous)
      ) {
        return [[...acc[0]], [...acc[1], currentOutput]];
      } else {
        return [[...acc[0], currentOutput], [...acc[0]]];
      }
    },
    [[], []]
  );
  return topLevelOutputs.map((output) => ({
    output: output,
    next:
      otherOutputs.length > 0
        ? buildOutputsTree(otherOutputs, output.name)
        : [],
  }));
};
