import React from "react";
import { ValidationErrors } from "./types";
import { Input } from "@xgovformbuilder/govuk-react-jsx";

type Props = {
  url: string;
  errors: ValidationErrors;
  onChange: Function;
};

const WebhookEdit = ({ url = "", errors, onChange }: Props) => (
  <Input
    id="url"
    name="url"
    label={{
      className: "govuk-label--s",
      children: ["Webhook url"],
    }}
    defaultValue={url}
    onChange={onChange}
    pattern="^\S+"
    errorMessage={errors?.url ? { children: errors?.url.children } : undefined}
  />
);

export default WebhookEdit;
