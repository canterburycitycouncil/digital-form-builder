import React, { useContext } from "react";
import { ComponentContext } from "../../reducers/component/componentReducer";
import { Actions } from "../../reducers/component/types";
import { CssClasses } from "../CssClasses";
import { i18n } from "../../i18n";
import { GovUKInput } from "../govuk-fields";

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
        fieldName="max-days-in-past-field"
        fieldParent="options"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={options.maxDaysInPast || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_PAST,
            payload: e.target.value,
          })
        }
      />
      <GovUKInput
        translationNamespace="dateFieldEditComponent"
        fieldName="max-days-in-future-field"
        fieldParent="options"
        customisationClasses={["govuk-input--width-3"]}
        type="number"
        value={options.maxDaysInPast || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE,
            payload: e.target.value,
          })
        }
      />

      {/* <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-maxDaysInPast"
        >
          {i18n("dateFieldEditComponent.maxDaysInPastField.title")}
        </label>
        <span className="govuk-hint">
          {i18n("dateFieldEditComponent.maxDaysInPastField.helpText")}
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-options-maxDaysInPast"
          name="options.maxDaysInPast"
          value={options.maxDaysInPast}
          type="number"
          onChange={(e) =>
            dispatch({
              type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_PAST,
              payload: e.target.value,
            })
          }
        />
      </div> */}

      {/* <div className="govuk-form-group">
        <label
          className="govuk-label govuk-label--s"
          htmlFor="field-options-maxDaysInFuture"
        >
          {i18n("dateFieldEditComponent.maxDaysInFutureField.title")}
        </label>
        <span className="govuk-hint">
          {i18n("dateFieldEditComponent.maxDaysInFutureField.helpText")}
        </span>
        <input
          className="govuk-input govuk-input--width-3"
          data-cast="number"
          id="field-options-maxDaysInFuture"
          name="options.maxDaysInFuture"
          value={options.maxDaysInFuture}
          type="number"
          onChange={(e) =>
            dispatch({
              type: Actions.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE,
              payload: e.target.value,
            })
          }
        />
      </div> */}

      <CssClasses />
    </details>
  );
}
