import React, { useContext } from "react";
import { ComponentContext } from "../../reducers/component/componentReducer";
import { Actions } from "../../reducers/component/types";

import { CssClasses } from "../CssClasses";
import { i18n } from "../../i18n";
import { GovUKInput } from "../govuk-fields";

type Props = {
  context: any; // TODO
};

export function NumberFieldEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context);
  const { selectedComponent } = state;
  const { schema = {} } = selectedComponent;

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n("common.detailsLink.title")}
        </span>
      </summary>

      <GovUKInput
        translationNamespace="numberFieldEditComponent"
        fieldName="min"
        fieldParent="schema"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={schema.min || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_MIN,
            payload: e.target.value,
          })
        }
      />

      <GovUKInput
        translationNamespace="numberFieldEditComponent"
        fieldName="max"
        fieldParent="schema"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={schema.max || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_MAX,
            payload: e.target.value,
          })
        }
      />

      <GovUKInput
        translationNamespace="numberFieldEditComponent"
        fieldName="precision"
        fieldParent="schema"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={schema.precision || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_PRECISION,
            payload: e.target.value,
          })
        }
      />

      <CssClasses />
    </details>
  );
}
