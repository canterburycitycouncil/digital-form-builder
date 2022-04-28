import { Autocomplete } from "designer/client/components/Autocomplete";
import { CssClasses } from "designer/client/components/CssClasses";
import { CustomValidationMessage } from "designer/client/components/CustomValidationMessage";
import { GovUKInput } from "designer/client/components/govuk-fields";
import { i18n } from "designer/client/i18n";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import { Actions } from "designer/client/reducers/component/types";
import React, { ReactNode, useContext } from "react";

type Props = {
  context: any; // TODO
  children: ReactNode;
};

export function TextFieldEdit({ children, context = ComponentContext }: Props) {
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
        translationNamespace="textFieldEditComponent"
        fieldName="min-length-field"
        fieldParent="schema"
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
        translationNamespace="textFieldEditComponent"
        fieldName="max-length-field"
        fieldParent="schema"
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
        translationNamespace="textFieldEditComponent"
        fieldName="length-field"
        fieldParent="schema"
        type="number"
        value={schema.length || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_LENGTH,
            payload: e.target.nodeValue,
          })
        }
      />

      <GovUKInput
        translationNamespace="textFieldEditComponent"
        fieldName="regex-field"
        fieldParent="schema"
        type="number"
        value={schema.regex || ""}
        handleChange={(e) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_REGEX,
            payload: e.target.nodeValue,
          })
        }
      />

      {children}

      <Autocomplete />

      <CssClasses />

      {selectedComponent.type === "TelephoneNumberField" && (
        // Remove type check when fully integrated into all runner components
        <CustomValidationMessage />
      )}
    </details>
  );
}
