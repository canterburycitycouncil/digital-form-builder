import { allInputs } from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { topdeskTemplates } from "@xgovformbuilder/designer/server/lib/outputs/topdesk";
import { Select } from "govuk-react-jsx";
import React, { ChangeEvent } from "react";
import { useContext } from "react";

import { ValidationErrors } from "./types";

type Props = {
  template: string;
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

const TopdeskEdit = ({
  template,
  email,
  briefDescription,
  onChange,
  errors,
}: Props) => {
  const { data } = useContext(DataContext);
  return (
    <div className="govuk-body email-edit">
      <Select
        id="template"
        items={[
          { children: "- Please select -", value: "" },
          { children: "None", value: "none" },
          ...topdeskTemplates.map((template) => ({
            children: template.briefDescription,
            value: template.number,
          })),
        ]}
        label={{
          className: "govuk-label--s",
          children: ["Change template"],
        }}
        hint={{
          children: [
            "The template to be used for creating the change request in TOPdesk",
          ],
        }}
        name="template"
        value={template}
        onChange={(e) => onChange(e)}
        errorMessage={
          errors?.url ? { children: errors?.url.children } : undefined
        }
      />
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
      {template === "none" && (
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
      )}
    </div>
  );
};

export default TopdeskEdit;
