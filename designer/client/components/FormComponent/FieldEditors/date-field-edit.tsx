import { ComponentContext } from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/componentReducer";
import { Actions } from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/types";
import { CssClasses } from "@xgovformbuilder/designer/client/components/FormComponent/components/CssClasses";
import { GovUKInput } from "@xgovformbuilder/designer/client/components/GovUKFields";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import React, { useContext } from "react";

type Props = {
  context: any; // TODO
};

export function DateFieldEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context);
  const { selectedComponent } = state;
  const { options = {} } = selectedComponent;

  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {i18n("common.detailsLink.title")}
        </span>
      </summary>

      <GovUKInput
        translationNamespace="dateFieldEditComponent"
        fieldName="max-Days-In-Past-Field"
        fieldParent="options"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={options.maxDaysInPast || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_PAST,
            payload: e.target.nodeValue,
          })
        }
      />
      <GovUKInput
        translationNamespace="dateFieldEditComponent"
        fieldName="max-Days-In-Future-Field"
        fieldParent="options"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={options.maxDaysInPast || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE,
            payload: e.target.nodeValue,
          })
        }
      />

      <CssClasses />
    </details>
  );
}
