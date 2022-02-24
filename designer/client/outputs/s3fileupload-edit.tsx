import React from "react";
import { ValidationErrors } from "./types";
import { Input } from "@govuk-jsx/input";

type Props = {
  apiKey: string;
  endpoint: string;
  errors: ValidationErrors;
};

const S3FileUploadEdit = ({ apiKey, endpoint, errors }: Props) => (
  <React.Fragment>
    <Input
      id="s3fileupload-apikey"
      name="s3fileupload-apikey"
      label={{
        className: "govuk-label--s",
        children: ["S3FileUpload apikey"],
      }}
      defaultValue={apiKey}
      pattern="^\S+"
      errorMessage={
        errors?.url ? { children: errors?.url.children } : undefined
      }
    />
    <Input
      id="s3fileupload-endpoint"
      name="s3fileupload-endpoint"
      label={{
        className: "govuk-label--s",
        children: ["S3FileUpload endpoint"],
      }}
      defaultValue={endpoint}
      pattern="^\S+"
      errorMessage={
        errors?.url ? { children: errors?.url.children } : undefined
      }
    />
  </React.Fragment>
);

export default S3FileUploadEdit;
