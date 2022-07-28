import { CssClasses } from "@xgovformbuilder/designer/client/components/FormComponent/components/CssClasses";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { FileUploadFieldComponent } from "@xgovformbuilder/model";
import React, { useContext } from "react";

import { ComponentContext } from "../componentReducer/componentReducer";
import { Actions } from "../componentReducer/types";

export function FileUploadFieldEdit() {
  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent } = state;
  const { options = {} } = selectedComponent;

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n("common.detailsLink.title")}
        </span>
      </summary>

      <div className="govuk-checkboxes govuk-form-group">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="field-options.multiple"
            name="options.multiple"
            type="checkbox"
            checked={
              (options as FileUploadFieldComponent["options"]).multiple ===
              false
            }
            onChange={(e) => {
              e.preventDefault();
              dispatch({
                type: Actions.EDIT_OPTIONS_FILE_UPLOAD_MULTIPLE,
                payload: !(options as FileUploadFieldComponent["options"])
                  .multiple,
              });
            }}
          />
          <label
            className="govuk-label govuk-checkboxes__label"
            htmlFor="field-options.multiple"
          >
            {i18n("fileUploadFieldEditPage.multipleFilesOption.title")}
          </label>
          <span className="govuk-hint govuk-checkboxes__hint">
            {i18n("fileUploadFieldEditPage.multipleFilesOption.helpText")}
          </span>
        </div>
      </div>

      <CssClasses />
    </details>
  );
}
