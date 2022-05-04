import { ComponentContext } from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/componentReducer";
import { Actions } from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/types";
import { GovUKInput } from "@xgovformbuilder/designer/client/components/GovUKFields";
import { TelephoneNumberFieldComponent } from "@xgovformbuilder/model/src";
import React, { useContext } from "react";

export function CustomValidationMessage() {
  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent } = state;
  const { options = {} } = selectedComponent as TelephoneNumberFieldComponent;

  return (
    <GovUKInput
      translationNamespace="common"
      fieldName="custom-validation-message"
      fieldParent="options"
      type="text"
      value={options.customValidation || ""}
      handleChange={(e) =>
        dispatch({
          type: Actions.EDIT_OPTIONS_CUSTOM_MESSAGE,
          payload: e.target.value,
        })
      }
    />
    // <div className="govuk-form-group">
    //   <label
    //     className="govuk-label govuk-label--s"
    //     htmlFor="field-options-custom-validation-message"
    //   >
    //     {i18n("common.customValidation.title")}
    //   </label>
    //   <span className="govuk-hint">
    //     {i18n("common.customValidation.helpText")}
    //   </span>
    //   <input
    //     className="govuk-input"
    //     id="field-options-custom-validation-message"
    //     name="options.customValidation"
    //     type="text"
    //     value={options?.customValidation ?? ""}
    //     onChange={(e) =>
    //       dispatch({
    //         type: Actions.EDIT_OPTIONS_CUSTOM_MESSAGE,
    //         payload: e.target.value,
    //       })
    //     }
    //   />
    // </div>
  );
}
