import { Request, ResponseToolkit } from "@hapi/hapi";
import { returnResponse } from "../../helpers";
import { submissionPayload } from "../../types";
import fetch from "node-fetch";
import config from "../../../../config";

export const saveSubmissionHandler = (request: Request, h: ResponseToolkit) => {
  return new Promise((resolve) => {
    const {
      formValues,
      submissionId,
      submissionType,
      userId,
      formId,
      status,
    } = request.payload as submissionPayload;
    if (formValues && submissionType && userId && formId && status) {
      let url = "";
      let method = "";
      if (!submissionId) {
        url =
          "https://6zy0ta2uxg.execute-api.eu-west-2.amazonaws.com/dev/submissions";
        method = "POST";
      } else {
        url = `https://6zy0ta2uxg.execute-api.eu-west-2.amazonaws.com/dev/submissions/${submissionId}`;
        method = "PUT";
      }
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": config.awsApiKey || "",
        },
        body: JSON.stringify(request.payload),
      })
        .then((res) => res.json())
        .then((res) => resolve(returnResponse(h, res, 200, "application/json")))
        .catch((err) =>
          resolve(returnResponse(h, err as Error, 500, "application/json"))
        );
    } else {
      resolve(
        returnResponse(
          h,
          "Some properties are missing from the submission payload",
          400,
          "application/json"
        )
      );
    }
  });
};
