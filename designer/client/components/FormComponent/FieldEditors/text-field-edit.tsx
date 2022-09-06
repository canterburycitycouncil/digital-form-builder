import { GovUKInput } from "@xgovformbuilder/designer/client/components/GovUKFields";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import React, { ReactNode, useContext } from "react";

import { ComponentContext } from "../componentReducer/componentReducer";
import { Actions } from "../componentReducer/types";
import { Autocomplete } from "../components/Autocomplete";
import { CssClasses } from "../components/CssClasses";
import { CustomValidationMessage } from "../components/CustomValidationMessage";

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
        fieldName="min-Length-Field"
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
        fieldName="max-Length-Field"
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
        fieldName="length-Field"
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
        fieldName="regex-Field"
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
