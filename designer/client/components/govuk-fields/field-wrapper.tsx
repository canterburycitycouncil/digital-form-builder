import React from "react";
import { i18n } from "../../i18n";
import { convertFieldNameToCamelCase } from "./helpers";

interface WrapperProps {
  fieldName: string;
  fieldParent?: string;
  translationNamespace: string;
  children: React.ReactNode;
}

export const GovUKFieldWrapper = ({
  fieldName,
  fieldParent,
  translationNamespace,
  children,
}: WrapperProps) => {
  const translationName = `${translationNamespace}.${convertFieldNameToCamelCase(
    fieldName
  )}`;
  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor={`field-${
          fieldParent ? fieldParent + "-" + fieldName : fieldName
        }`}
      >
        {i18n(`${translationName}.title`)}
      </label>
      <span className="govuk-hint">{i18n(`${translationName}.helpText`)}</span>
      {children}
    </div>
  );
};
