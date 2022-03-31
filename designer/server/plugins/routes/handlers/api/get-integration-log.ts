import { Request, ResponseToolkit } from "@hapi/hapi";
import { returnResponse } from "../../helpers";
import fetch from "node-fetch";

export const getIntegrationLogHandler = (
  request: Request,
  h: ResponseToolkit
) => {
  const { integrationId } = request.params;

  const url = `https://6zy0ta2uxg.execute-api.eu-west-2.amazonaws.com/dev/integration-log/${integrationId}`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.AWS_API_KEY as string,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(returnResponse(h, res, 200, "application/json"));
      })
      .catch((err) => {
        reject(returnResponse(h, err, 500, "application.json"));
      });
  });
};
