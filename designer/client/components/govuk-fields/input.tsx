import React, { ChangeEventHandler } from "react";
import { i18n } from "../../i18n";

interface InputProps {
  translationNamespace: string;
  fieldName: string;
  fieldParent?: string;
  handleChange: ChangeEventHandler;
  value: string;
}

export const GovUKInput = ({
  translationNamespace,
  fieldName,
  fieldParent,
  handleChange,
  value,
}: InputProps) => {
  const translationName = `${translationNamespace}.${fieldName}`;

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
      <input
        className="govuk-input"
        id="field-options-autocomplete"
        name="options.autocomplete"
        type="text"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
