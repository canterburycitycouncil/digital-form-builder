import { GovUKFieldWrapper } from "designer/client/components/govuk-fields/field-wrapper";
import { convertFieldNameToCamelCase } from "designer/client/components/govuk-fields/helpers";
import React, { ChangeEventHandler } from "react";

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
