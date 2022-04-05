import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  Submission,
  SubmissionKey,
} from "../../../../../client/submissions/types";
import { returnResponse } from "../../helpers";
import fetch from "node-fetch";

interface AllSubmissionsResponse {
  submissions: Submission[];
  lastKey?: SubmissionKey;
}

export const getFormSubmissionsHandler = (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const { subType, lastKey } = request.query;
  const url = `https://6zy0ta2uxg.execute-api.eu-west-2.amazonaws.com/dev/submissions?formId=${id}&subType=${subType}${
    lastKey ? "&startKey=" + lastKey : ""
  }`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.AWS_API_KEY as string,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let submissionRes: AllSubmissionsResponse = {
          submissions: res.Items as Submission[],
        };
        if (res.LastEvaluatedKey) {
          submissionRes.lastKey = res.LastEvaluatedKey;
        }
        resolve(returnResponse(h, submissionRes, 200, "application/json"));
      })
      .catch((err) => {
        reject(returnResponse(h, err, 500, "application/json"));
      });
  });
};
