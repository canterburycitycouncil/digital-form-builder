import { WebhookOutputConfiguration } from "@xgovformbuilder/model";
export const webhook = async (
  config: WebhookOutputConfiguration,
  formValues
) => {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });

  return response.json();
};
