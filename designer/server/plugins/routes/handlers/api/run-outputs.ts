import { freshdesk, s3fileupload, webhook } from "../../../../lib/outputs";
import {
  FreshdeskOutputConfiguration,
  WebhookOutputConfiguration,
  S3FileUploadOutputConfiguration,
} from "../../../../../client/pages/Outputs/outputs/types";
import { FileResponse, FileUpload } from "../../../../lib/outputs/s3fileupload";
import { OutputRequest, IntegrationLog } from "../../types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { getTrueSubmission, returnResponse } from "../../helpers";
import fetch from "node-fetch";

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
        let integrationLogsArray: IntegrationLog[] = [];
        let promiseArray: Promise<string | FileResponse>[] = [];
        formScheme.outputs.forEach((output) => {
          switch (output.type) {
            case "email":
              break;
            case "notify":
              break;
            case "webhook":
              let webhookPromise = webhook(
                output.outputConfiguration as WebhookOutputConfiguration,
                submission.formValues
              );
              promiseArray.push(webhookPromise);
              integrationLogsArray.push({
                submissionId: submission.submissionId,
                integrationName: output.title,
                integrationType: output.type,
                configuration: output.outputConfiguration,
                request: submission.formValues,
              });
              break;
            case "freshdesk":
              let fdPromise = freshdesk(
                output.outputConfiguration as FreshdeskOutputConfiguration,
                submission,
                submission.formValues
              );
              promiseArray.push(fdPromise);
              integrationLogsArray.push({
                submissionId: submission.submissionId,
                integrationName: output.title,
                integrationType: output.type,
                configuration: output.outputConfiguration,
                request: submission.formValues,
              });
              break;
            case "s3fileupload":
              let s3Promise = s3fileupload(
                output.outputConfiguration as S3FileUploadOutputConfiguration,
                submission,
                filesDecoded
              );
              promiseArray.push(s3Promise);
              integrationLogsArray.push({
                submissionId: submission.submissionId,
                integrationName: output.title,
                integrationType: output.type,
                configuration: output.outputConfiguration,
                request: {
                  submission: submission,
                  files: filesDecoded.map((file) => file.filename),
                },
              });
              break;
            default:
              const message = "No output of that type found";
              resolve(returnResponse(h, message, 400, "application/json"));
          }
        });
        Promise.all(promiseArray)
          .then((res) => {
            console.log(integrationLogsArray);
            let integrationLogPromises: Promise<any>[] = [];
            res.forEach((response, index) => {
              integrationLogsArray[index].response = response;
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
                      body: JSON.stringify(integrationLogsArray[index]),
                    }
                  )
                    .then(() => {
                      console.log("hello");
                      resolve("");
                    })
                    .catch((err) => reject(err));
                })
              );
            });
            let possibleSubmissionChanges = res.filter(
              (response) =>
                response.constructor.name === "object" &&
                Object.keys(response).indexOf("submission") > -1
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
