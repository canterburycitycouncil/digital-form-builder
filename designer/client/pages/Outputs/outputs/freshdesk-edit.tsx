import { Input } from "@xgovformbuilder/govuk-react-jsx";
import React from "react";

import { ValidationErrors } from "./types";

type Props = {
  customFields: string;
  apiKey: string;
  freshdeskHost: string;
  errors: ValidationErrors;
  onChange: Function;
};

const FreshdeskEdit = ({
  apiKey = "",
  freshdeskHost = "",
  customFields = "",
  errors,
  onChange,
}: Props) => (
  <React.Fragment>
    <Input
      id="freshdeskHost"
      name="freshdeskHost"
      label={{
        className: "govuk-label--s",
        children: ["Freshdesk host"],
      }}
      defaultValue={freshdeskHost}
      onChange={onChange}
      pattern="^\S+"
      errorMessage={
        errors?.freshdeskHost
          ? { children: errors?.freshdeskHost.children }
          : undefined
      }
    />
    <Input
      id="apiKey"
      name="apiKey"
      label={{
        className: "govuk-label--s",
        children: ["API key"],
      }}
      defaultValue={apiKey}
      onChange={onChange}
      pattern="^\S+"
      errorMessage={
        errors?.apiKey ? { children: errors?.apiKey.children } : undefined
      }
    />
    <Input
      id="customFields"
      name="customFields"
      label={{
        className: "govuk-label--s",
        children: ["Custom fields"],
      }}
      defaultValue={customFields}
      onChange={onChange}
      pattern="^\S+"
      errorMessage={
        errors?.customFields
          ? { children: errors?.customFields.children }
          : undefined
      }
    />
  </React.Fragment>
);

export default FreshdeskEdit;
