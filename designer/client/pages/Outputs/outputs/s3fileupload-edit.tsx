import { Input } from "@xgovformbuilder/govuk-react-jsx";
import React from "react";

import { ValidationErrors } from "./types";

type Props = {
  apiKey: string;
  endpoint: string;
  errors: ValidationErrors;
  onChange: Function;
};

const S3FileUploadEdit = ({ apiKey, endpoint, errors, onChange }: Props) => (
  <React.Fragment>
    <Input
      id="apikey"
      name="apikey"
      label={{
        className: "govuk-label--s",
        children: ["S3FileUpload apikey"],
      }}
      defaultValue={apiKey}
      onChange={onChange}
      pattern="^\S+"
      errorMessage={
        errors?.url ? { children: errors?.url.children } : undefined
      }
    />
    <Input
      id="endpoint"
      name="endpoint"
      label={{
        className: "govuk-label--s",
        children: ["S3FileUpload endpoint"],
      }}
      defaultValue={endpoint}
      onChange={onChange}
      pattern="^\S+"
      errorMessage={
        errors?.url ? { children: errors?.url.children } : undefined
      }
    />
  </React.Fragment>
);

export default S3FileUploadEdit;
