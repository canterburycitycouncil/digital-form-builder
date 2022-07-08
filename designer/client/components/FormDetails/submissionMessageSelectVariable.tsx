import { FormDefinition } from "@xgovformbuilder/model";
import { Select } from "govuk-react-jsx";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";

import { allInputs } from "../FormComponent/componentData";

interface Props {
  data: FormDefinition;
  onSave: (variable: string) => void;
}

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

export const SubmissionMessageSelectVariable: FC<Props> = ({
  onSave,
  data,
}) => {
  const [variable, setVariable] = useState<string>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(`{${variable}}`);
  };

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setVariable(e.target.value);
  };

  return (
    <div>
      <Select
        id="variable"
        items={[
          {
            children: "- Please select -",
            value: "",
          },
          ...fieldsForPath(data),
        ]}
        label={{
          className: "govuk-label--s",
          children: ["Select variable"],
        }}
        hint={{
          children: [
            "Select a variable from the form to insert into the submission message",
          ],
        }}
        name="variable"
        value={variable}
        onChange={(e) => onChange(e)}
      />
      <button
        type="button"
        className="govuk-button"
        onClick={(e) => handleSubmit(e)}
      >
        Save
      </button>
    </div>
  );
};
