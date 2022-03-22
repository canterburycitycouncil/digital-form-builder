import { freshdesk, s3fileupload, webhook } from "../../../../lib/outputs";
import {
  FreshdeskOutputConfiguration,
  WebhookOutputConfiguration,
  S3FileUploadOutputConfiguration,
} from "../../../../../client/outputs/types";
import { FileResponse, FileUpload } from "../../../../lib/outputs/s3fileupload";
import { OutputRequest } from "../../types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { returnResponse } from "../../helpers";

export const runOutputsHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  return new Promise((resolve) => {
    console.log(request.payload);
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
              break;
            case "freshdesk":
              let fdPromise = freshdesk(
                output.outputConfiguration as FreshdeskOutputConfiguration,
                submission,
                submission.formValues
              );
              promiseArray.push(fdPromise);
              break;
            case "s3fileupload":
              let s3Promise = s3fileupload(
                output.outputConfiguration as S3FileUploadOutputConfiguration,
                submission,
                filesDecoded
              );
              promiseArray.push(s3Promise);
              break;
            default:
              const message = "No output of that type found";
              resolve(returnResponse(h, message, 400, "application/json"));
          }
        });
        console.log(promiseArray);
        Promise.all(promiseArray)
          .then((res) => {
            resolve(returnResponse(h, res, 200, "application/json"));
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
