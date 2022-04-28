import { i18n } from "designer/client/i18n";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import { Actions } from "designer/client/reducers/component/types";
import React, { useContext } from "react";

export function CssClasses() {
  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent } = state;
  const { options = {} } = selectedComponent;

  return (
    <div className="govuk-form-group">
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-classes"
      >
        {i18n("common.classes.title")}
      </label>
      <span className="govuk-hint">{i18n("common.classes.helpText")}</span>
      <input
        className="govuk-input"
        id="field-options-classes"
        name="options.classes"
        type="text"
        value={options.classes || ""}
        onChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_CLASSES,
            payload: e.target.value,
          })
        }
      />
    </div>
  );
}
