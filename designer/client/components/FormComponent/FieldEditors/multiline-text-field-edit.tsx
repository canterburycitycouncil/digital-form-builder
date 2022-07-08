import { TextFieldEdit } from "@xgovformbuilder/designer/client/components/FormComponent/FieldEditors/text-field-edit";
import { MultilineTextFieldComponent } from "@xgovformbuilder/model";
import React, { useContext } from "react";

import { ComponentContext } from "../componentReducer/componentReducer";
import { Actions } from "../componentReducer/types";

export function MultilineTextFieldEdit({ context = ComponentContext }) {
  const { state, dispatch } = useContext(context);
  const { selectedComponent } = state;
  const { options = {} } = selectedComponent;

  return (
    <TextFieldEdit context={context}>
      <input
        className="govuk-input govuk-input--width-3"
        id="field-options-rows"
        name="options.rows"
        type="text"
        data-cast="number"
        value={(options as MultilineTextFieldComponent["options"]).rows || ""}
        onChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_ROWS,
            payload: e.target.value,
          })
        }
      />
    </TextFieldEdit>
  );
}
