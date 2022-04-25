import React, { ChangeEventHandler } from "react";
import { convertFieldNameToCamelCase } from "./helpers";
import { GovUKFieldWrapper } from "./field-wrapper";

interface InputProps {
  translationNamespace: string;
  fieldName: string;
  fieldParent?: string;
  type: string;
  customisationClasses?: string[];
  handleChange: ChangeEventHandler;
  value: string;
}

export const GovUKInput = ({
  translationNamespace,
  fieldName,
  fieldParent,
  type,
  customisationClasses,
  handleChange,
  value,
}: InputProps) => {
  return (
    <GovUKFieldWrapper
      translationNamespace={translationNamespace}
      fieldName={fieldName}
      fieldParent={fieldParent}
    >
      <input
        className={
          `govuk-input` +
          (customisationClasses ? customisationClasses.join(" ") : "")
        }
        id={`field-${fieldParent ? fieldParent + "-" + fieldName : fieldName}`}
        name={
          fieldParent
            ? fieldParent + "." + convertFieldNameToCamelCase(fieldName)
            : convertFieldNameToCamelCase(fieldName)
        }
        type={type}
        value={value}
        onChange={handleChange}
      />
    </GovUKFieldWrapper>
  );
};
