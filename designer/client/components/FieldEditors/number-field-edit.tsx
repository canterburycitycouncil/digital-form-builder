import { CssClasses } from "designer/client/components/CssClasses";
import { GovUKInput } from "designer/client/components/govuk-fields";
import { i18n } from "designer/client/i18n";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import { Actions } from "designer/client/reducers/component/types";
import React, { useContext } from "react";

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
            payload: e.target.nodeValue,
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
            payload: e.target.nodeValue,
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
            payload: e.target.nodeValue,
          })
        }
      />

      <CssClasses />
    </details>
  );
}
