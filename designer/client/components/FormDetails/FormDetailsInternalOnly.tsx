import { i18n } from "@xgovformbuilder/designer/client/i18n";
import React, { ChangeEvent } from "react";

interface Props {
  handleInternalOnlyInputBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  internalOnly: boolean;
}
export const FormDetailsInternalOnly = (props: Props) => {
  const { internalOnly, handleInternalOnlyInputBlur } = props;

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id="field-options-internalOnly"
        name="options.internalOnly"
        type="checkbox"
        checked={internalOnly}
        onChange={handleInternalOnlyInputBlur}
      />
      <label
        className="govuk-label govuk-checkboxes__label"
        htmlFor="field-options-internalOnly"
      >
        {i18n("formDetails.internalOnly")}
      </label>
    </div>
  );
};
