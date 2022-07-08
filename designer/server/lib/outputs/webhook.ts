import { WebhookOutputConfiguration } from "@xgovformbuilder/model";
export const webhook = (
  _config: WebhookOutputConfiguration,
  _formValues
): Promise<string> => {
  return new Promise((resolve, reject) => {
    resolve("hello");
    reject("Oh no!");
  });
};
