import React, { useContext } from "react";
import { ComponentContext } from "../../componentReducer/componentReducer";
import { Actions } from "../../componentReducer/types";
import { GovUKInput } from "../../../GovUKFields";

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
  );
}
