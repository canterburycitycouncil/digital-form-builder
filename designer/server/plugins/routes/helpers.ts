import Wreck from "@hapi/wreck";
import config from "../../config";
import { FormConfiguration } from "../../../../model";
import { ResponseToolkit } from "@hapi/hapi";
import * as _ from "lodash";

export const getPublished = async function (id, persistenceService) {
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

export const returnResponse = (
  h: ResponseToolkit,
  message: any,
  code: number,
  type?: string
) => {
  if (type) {
    return h.response(message).code(code).type(type);
  } else {
    return h.response(message).code(code);
  }
};

export const getTrueSubmission = (
  initialSubmission: any,
  mutatedSubmissions: any[]
) => {
  let trueSubmission = { ...initialSubmission };
  mutatedSubmissions.forEach((submission) => {
    let changedPages = _.reduce(
      submission.formValues,
      function (result: string[], value, key) {
        return _.isEqual(value, trueSubmission.formValues[key])
          ? result
          : result.concat([key]);
      },
      []
    );
    changedPages.forEach((page) => {
      Object.keys(submission.formValues[page]).forEach((field) => {
        if (
          submission.formValues[page][field] !==
            trueSubmission.formValues[page][field] &&
          submission.formValues[page][field] !==
            initialSubmission.formValues[page][field]
        ) {
          trueSubmission.formValues[page][field] =
            submission.formValues[page][field];
        }
      });
    });
  });
  return trueSubmission;
};
