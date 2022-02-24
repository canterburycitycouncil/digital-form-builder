import { S3FileUploadOutputConfiguration } from "@xgovformbuilder/model";
export const s3fileupload = async (
  config: S3FileUploadOutputConfiguration,
  formValues
) => {
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
    },
    body: JSON.stringify(formValues),
  });

  return response.json();
};
