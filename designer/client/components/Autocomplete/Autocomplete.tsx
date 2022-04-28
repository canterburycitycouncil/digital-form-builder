import { GovUKInput } from "designer/client/components/govuk-fields";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import { Actions } from "designer/client/reducers/component/types";
import React, { useContext } from "react";

export function Autocomplete() {
  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent } = state;
  const { options = {} } = selectedComponent;

  return (
    <GovUKInput
      translationNamespace="common"
      fieldName="autocomplete"
      fieldParent="options"
      type="text"
      value={options.autocomplete || ""}
      handleChange={(e) =>
        dispatch({
          type: Actions.EDIT_OPTIONS_AUTOCOMPLETE,
          payload: e.target.value,
        })
      }
    />
    // <div className="govuk-form-group">
    //   <label
    //     className="govuk-label govuk-label--s"
    //     htmlFor="field-options-autocomplete"
    //   >
    //     {i18n("common.autocomplete.title")}
    //   </label>
    //   <span className="govuk-hint">{i18n("common.autocomplete.helpText")}</span>
    //   <input
    //     className="govuk-input"
    //     id="field-options-autocomplete"
    //     name="options.autocomplete"
    //     type="text"
    //     value={options.autocomplete || ""}
    //     onChange={(e) =>
    //       dispatch({
    //         type: Actions.EDIT_OPTIONS_AUTOCOMPLETE,
    //         payload: e.target.value,
    //       })
    //     }
    //   />
    // </div>
  );
}
