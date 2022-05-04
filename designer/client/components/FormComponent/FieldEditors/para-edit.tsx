import { GovUKFieldWrapper } from "@xgovformbuilder/designer/client/components/GovUKFields";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import Editor from "@xgovformbuilder/designer/client/editor";
import { ContentOptions, FormDefinition } from "@xgovformbuilder/model/src";
import React, { useContext } from "react";

import { ComponentContext } from "../componentReducer/componentReducer";
import { Actions } from "../componentReducer/types";

type Props = {
  context: any; // TODO
};

export function ParaEdit({ context = ComponentContext }: Props) {
  // If you are editing a component, the default context will be ComponentContext because props.context is undefined,
  // but if you editing a component which is a children of a list based component, then the props.context is the ListContext.
  const { state, dispatch } = useContext(context);
  const { selectedComponent } = state;
  const { data } = useContext(DataContext);
  const { options = {} }: { options: ContentOptions } = selectedComponent;
  const { conditions } = data as FormDefinition;

  return (
    <div>
      <GovUKFieldWrapper fieldName="para" translationNamespace="fieldEdit">
        <Editor
          id="field-content"
          name="content"
          required={true}
          value={selectedComponent.content}
          valueCallback={(content) => {
            dispatch({
              type: Actions.EDIT_CONTENT,
              payload: content,
            });
          }}
        />
      </GovUKFieldWrapper>
      <GovUKFieldWrapper
        fieldName="conditions"
        translationNamespace="fieldEdit"
      >
        <select
          className="govuk-select"
          id="condition"
          name="options.condition"
          value={options.condition}
          onChange={(e) =>
            dispatch({
              type: Actions.EDIT_OPTIONS_CONDITION,
              payload: e.target.value,
            })
          }
        >
          <option value="" />
          {conditions.map((condition) => (
            <option key={condition.name} value={condition.name}>
              {condition.displayName}
            </option>
          ))}
        </select>
      </GovUKFieldWrapper>
    </div>
  );
}
