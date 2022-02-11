import { WebhookOutputConfiguration } from "@xgovformbuilder/model";
export const webhook = (
  config: WebhookOutputConfiguration,
  formValues
): Promise<string> => {
  return new Promise((resolve, reject) => {
    resolve("hello");
    reject("Oh no!");
  });
};
