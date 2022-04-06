import React, { useContext } from "react";
import { ComponentContext } from "../../formComponentCreationForm/componentReducer/componentReducer";
import { Actions } from "../../formComponentCreationForm/componentReducer/types";
import { TelephoneNumberFieldComponent } from "@xgovformbuilder/model";
import { GovUKInput } from "../govuk-fields";

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
