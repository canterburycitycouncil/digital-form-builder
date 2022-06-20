import { Input } from "govuk-react-jsx";
import React, { ChangeEvent } from "react";

import { ValidationErrors } from "./types";

type Props = {
  endpoint: string;
  username: string;
  password: string;
  onChange: (e: ChangeEvent) => void;
  errors: ValidationErrors;
};

const TopdeskEdit = ({
  endpoint,
  username,
  password,
  onChange,
  errors,
}: Props) => {
  return (
    <div className="govuk-body email-edit">
      <Input
        id="endpoint"
        name="endpoint"
        label={{
          className: "govuk-label--s",
          children: ["Endpoint"],
        }}
        defaultValue={endpoint}
        onChange={(e) => onChange(e)}
        errorMessage={
          errors?.endpoint ? { children: errors?.endpoint.children } : undefined
        }
      />
      <Input
        id="username"
        name="username"
        label={{
          className: "govuk-label--s",
          children: ["Username"],
        }}
        defaultValue={username}
        onChange={(e) => onChange(e)}
        errorMessage={
          errors?.username ? { children: errors?.username.children } : undefined
        }
      />
      <Input
        id="password"
        name="password"
        label={{
          className: "govuk-label--s",
          children: ["Password"],
        }}
        defaultValue={password}
        onChange={(e) => onChange(e)}
        errorMessage={
          errors?.password ? { children: errors?.password.children } : undefined
        }
      />
    </div>
  );
};

export default TopdeskEdit;
