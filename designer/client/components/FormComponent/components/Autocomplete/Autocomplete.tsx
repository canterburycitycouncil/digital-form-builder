import { TextFieldComponent } from "model/src";
import React, { useContext } from "react";

import { GovUKInput } from "../../../GovUKFields";
import { ComponentContext } from "../../componentReducer/componentReducer";
import { Actions } from "../../componentReducer/types";

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
      value={(options as TextFieldComponent["options"]).autocomplete || ""}
      handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch({
          type: Actions.EDIT_OPTIONS_AUTOCOMPLETE,
          payload: e.target.value,
        })
      }
    />
  );
}
