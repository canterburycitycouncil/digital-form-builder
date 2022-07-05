import { allInputs } from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { Select } from "govuk-react-jsx";
import React, { ChangeEvent } from "react";
import { useContext } from "react";

import { ValidationErrors } from "./types";

type Props = {
  email: string;
  briefDescription: string;
  onChange: (e: ChangeEvent) => void;
  errors: ValidationErrors;
};

const fieldsForPath = (data) => {
  const inputs = allInputs(data);

  const fieldInputs = inputs.map((input) => {
    const label = input.title;
    return {
      children: label,
      value: input.name,
    };
  });

  return fieldInputs;
};

const TopdeskIncidentEdit = ({
  email,
  briefDescription,
  onChange,
  errors,
}: Props) => {
  const { data } = useContext(DataContext);
  return (
    <div className="govuk-body email-edit">
      <Select
        id="email"
        items={[
          {
            children: "- Please select -",
            value: "",
          },
          ...fieldsForPath(data),
        ]}
        label={{
          className: "govuk-label--s",
          children: ["Email"],
        }}
        hint={{
          children: ["Field to get the user's email from"],
        }}
        name="email"
        value={email}
        onChange={(e) => onChange(e)}
        errorMessage={
          errors?.url ? { children: errors?.url.children } : undefined
        }
      />
      <Select
        id="briefDescription"
        items={[
          {
            children: "- Please select -",
            value: "",
          },
          ...fieldsForPath(data),
        ]}
        label={{
          className: "govuk-label--s",
          children: ["Brief description"],
        }}
        hint={{
          children: [
            "Field to use for the brief description on the topdesk ticket to be populated from",
          ],
        }}
        name="briefDescription"
        value={briefDescription}
        onChange={(e) => onChange(e)}
        errorMessage={
          errors?.url ? { children: errors?.url.children } : undefined
        }
      />
    </div>
  );
};

export default TopdeskIncidentEdit;
