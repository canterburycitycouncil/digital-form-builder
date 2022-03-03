import newFormJson from "../../../new-form.json";
import { FormConfiguration, FormDefinition, Schema } from "../../../../model";
import Wreck from "@hapi/wreck";
import config from "../../config";
import { publish } from "../../lib/publish";
import { ServerRoute, ResponseObject } from "@hapi/hapi";
import { OutputType, Output } from "@xgovformbuilder/model";
import { freshdesk, s3fileupload, webhook } from "../../lib/outputs";
import {
  FreshdeskOutputConfiguration,
  WebhookOutputConfiguration,
  S3FileUploadOutputConfiguration,
} from "../../../client/outputs/types";

const getPublished = async function (id, persistenceService) {
  if (config.persistentBackend === "dynamoDB") {
    const payload = persistenceService.getConfiguration(id);
    return payload;
  } else {
    const { payload } = await Wreck.get<FormConfiguration>(
      `${config.publishUrl}/published/${id}`
    );
    return payload.toString();
  }
};

export const getFormWithId: ServerRoute = {
  // GET DATA
  method: "GET",
  path: "/api/{id}/data",
  options: {
    handler: async (request, h) => {
      const { id } = request.params;
      let formJson = newFormJson;
      try {
        let response;
        const { persistenceService } = request.services([]);
        response = await getPublished(id, persistenceService);
        const values = JSON.parse(response);
        if (values) {
          values.pages = values.pages;
          formJson = values;
        }
      } catch (error) {
        request.logger.error(error);
      }

      return h.response(formJson).type("application/json");
    },
  },
};

type OutputRequest = {
  formScheme: FormDefinition;
  submission: object;
};

export const runOutputs: ServerRoute = {
  method: "POST",
  path: "/api/outputs",
  options: {
    payload: {
      parse: true,
    },
    cors: {
      origin: ["http://localhost:8000"],
    },
    handler: async (request, h) => {
      return new Promise((resolve, reject) => {
        const { submission, formScheme } = request.payload as OutputRequest;
        let promiseArray: Promise<string>[] = [];
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
                formScheme,
                submission
              );
              promiseArray.push(s3Promise);
              break;
            default:
              resolve(
                h
                  .response("no output of that type found")
                  .code(400)
                  .type("application/json")
              );
          }
        });
        Promise.all(promiseArray)
          .then((res) => {
            console.log(res);
            resolve(h.response("it works").code(200).type("application/json"));
          })
          .catch((err) => {
            console.log(err);
            resolve(h.response(err.message).code(500).type("application/json"));
          });
      });
    },
  },
};

export const putFormWithId: ServerRoute = {
  // SAVE DATA
  method: "PUT",
  path: "/api/{id}/data",
  options: {
    payload: {
      parse: true,
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { persistenceService } = request.services([]);

      try {
        const { value, error } = Schema.validate(request.payload, {
          abortEarly: false,
        });

        if (error) {
          request.logger.error(
            ["error", `/api/${id}/data`],
            [error, request.payload]
          );

          throw new Error("Schema validation failed, reason: " + error.message);
        }
        await persistenceService.uploadConfiguration(
          `${id}`,
          JSON.stringify(value)
        );
        // await publish(id, value);
        return h.response({ ok: true }).code(204);
      } catch (err) {
        request.logger.error(
          "Designer Server PUT /api/{id}/data error:",
          err.message
        );
        const errorSummary = {
          id: id,
          payload: request.payload,
          errorMessage: err.message,
          error: err.stack,
        };
        request.yar.set(`error-summary-${id}`, errorSummary);
        return h.response({ ok: false, err }).code(401);
      }
    },
  },
};

export const deleteFormWithId: ServerRoute = {
  method: "DELETE",
  path: "/api/{id}",
  options: {
    handler: async (request, h) => {
      const { id } = request.params;
      try {
        let response;
        const { persistenceService } = request.services([]);
        response = await persistenceService.deleteConfiguration(id);
      } catch (error) {
        request.logger.error(error);
        return h
          .response({ ok: false, message: error })
          .code(500)
          .type("application/json");
      }

      return h.response({ ok: true }).code(200).type("application/json");
    },
  },
};

export const getAllPersistedConfigurations: ServerRoute = {
  method: "GET",
  path: "/api/configurations",
  options: {
    handler: async (request, h): Promise<ResponseObject | undefined> => {
      const { persistenceService } = request.services([]);
      try {
        const response = await persistenceService.listAllConfigurations();
        return h.response(response).type("application/json");
      } catch (error) {
        request.server.log(["error", "/configurations"], error);
        return;
      }
    },
  },
};

export const log: ServerRoute = {
  method: "POST",
  path: "/api/log",
  options: {
    handler: async (request, h): Promise<ResponseObject | undefined> => {
      try {
        request.server.log(request.payload.toString());
        return h.response({ ok: true }).code(204);
      } catch (error) {
        return h.response({ ok: false }).code(500);
      }
    },
  },
};
