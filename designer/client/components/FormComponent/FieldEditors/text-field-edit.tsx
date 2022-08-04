import { GovUKInput } from "@xgovformbuilder/designer/client/components/GovUKFields";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { TextFieldComponent } from "@xgovformbuilder/model";
import React, { ChangeEvent, ReactNode, useContext } from "react";

import { ComponentContext } from "../componentReducer/componentReducer";
import { Actions } from "../componentReducer/types";
import { Autocomplete } from "../components/Autocomplete";
import { CssClasses } from "../components/CssClasses";
import { CustomValidationMessage } from "../components/CustomValidationMessage";

type Props = {
  context: any; // TODO
  children: ReactNode;
};

export function TextFieldEdit({ children }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent } = state;
  const { schema } = selectedComponent;

  console.log(state);

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
        value={(schema as TextFieldComponent["schema"])?.min?.toString() || ""}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_MIN,
            payload: e.target.value,
          })
        }
      />

      <GovUKInput
        translationNamespace="textFieldEditComponent"
        fieldName="max-Length-Field"
        fieldParent="schema"
        type="number"
        value={(schema as TextFieldComponent["schema"])?.max?.toString() || ""}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_MAX,
            payload: e.target.value,
          })
        }
      />

      <GovUKInput
        translationNamespace="textFieldEditComponent"
        fieldName="length-Field"
        fieldParent="schema"
        type="number"
        value={
          (schema as TextFieldComponent["schema"])?.length?.toString() || ""
        }
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_LENGTH,
            payload: e.target.value,
          })
        }
      />

      <GovUKInput
        translationNamespace="textFieldEditComponent"
        fieldName="regex-Field"
        fieldParent="schema"
        type="text"
        value={(schema as TextFieldComponent["schema"])?.regex || ""}
        handleChange={(e: ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: Actions.EDIT_SCHEMA_REGEX,
            payload: e.target.value,
          });
        }}
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
