import { ContentOptions } from "@xgovformbuilder/components";
import { GovUKFieldWrapper } from "designer/client/components/govuk-fields";
import { DataContext } from "designer/client/context";
import Editor from "designer/client/editor";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import { Actions } from "designer/client/reducers/component/types";
import React, { useContext } from "react";

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
  const { conditions } = data;

  return (
    <div>
      <GovUKFieldWrapper fieldName="para" translationNamespace="fieldEdit">
        <Editor
          id="field-content"
          name="content"
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
