import { Flyout } from "@xgovformbuilder/designer/client/components/Flyout";
import { allInputs } from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { RenderInPortal } from "@xgovformbuilder/designer/client/components/RenderInPortal";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { ConditionRawData, FormDefinition } from "@xgovformbuilder/model";
import React, { useContext, useState } from "react";

import InlineConditions from "./InlineConditions";

function useConditionsEditor() {
  const [
    editingCondition,
    setEditingCondition,
  ] = useState<null | ConditionRawData>(null);
  const [showAddCondition, setShowAddCondition] = useState(false);

  function onClickCondition(e, condition: ConditionRawData) {
    e.preventDefault();
    setEditingCondition(condition);
  }
  function onClickAddCondition(e) {
    e.preventDefault();
    setShowAddCondition(true);
  }
  function editFinished(e) {
    e?.preventDefault();
    setEditingCondition(null);
    setShowAddCondition(false);
  }
  function cancelInlineCondition(e) {
    e?.preventDefault?.();
    setEditingCondition(null);
    setShowAddCondition(false);
  }

  return {
    editingCondition,
    showAddCondition,
    onClickCondition,
    onClickAddCondition,
    editFinished,
    cancelInlineCondition,
  };
}

type Props = {
  path: string;
};

export function ConditionsEdit({ path }: Props) {
  const {
    editingCondition,
    showAddCondition,
    onClickCondition,
    onClickAddCondition,
    editFinished,
    cancelInlineCondition,
  } = useConditionsEditor();
  const { data } = useContext(DataContext);
  const { conditions } = data as FormDefinition;
  const inputs = allInputs(data as FormDefinition);
  console.log(conditions);
  return (
    <div className="govuk-body">
      <div className="govuk-hint">{i18n("conditions.hint")}</div>

      {!editingCondition && (
        <>
          {showAddCondition && (
            <RenderInPortal>
              <Flyout
                title={i18n("conditions.add")}
                onHide={cancelInlineCondition}
              >
                <InlineConditions
                  conditionsChange={cancelInlineCondition}
                  cancelCallback={cancelInlineCondition}
                  path={path}
                />
              </Flyout>
            </RenderInPortal>
          )}

          <ul className="govuk-list" data-testid="conditions-list">
            {conditions.map((condition) => (
              <li key={condition.name} data-testid="conditions-list-item">
                <a href="#" onClick={(e) => onClickCondition(e, condition)}>
                  {condition.displayName}
                </a>{" "}
                <small>{condition.name}</small>
                {/* {"   ("}
                <small>{condition.expression}</small>
                {")"} */}
              </li>
            ))}
            <li>
              <hr />
              {inputs.length > 0 && (
                <a
                  href="#"
                  id="add-condition-link"
                  className="govuk-button"
                  data-testid={"add-condition-link"}
                  onClick={onClickAddCondition}
                >
                  {i18n("conditions.add")}
                </a>
              )}
              {inputs.length <= 0 && (
                <div className="govuk-body">
                  <div className="govuk-hint">
                    {i18n("conditions.noFieldsAvailable")}
                  </div>
                </div>
              )}
            </li>
          </ul>
        </>
      )}
      {editingCondition && (
        <RenderInPortal>
          <div id="edit-conditions" data-testid="edit-conditions">
            <Flyout title={i18n("conditions.addOrEdit")} onHide={editFinished}>
              <InlineConditions
                path={path}
                condition={editingCondition}
                conditionsChange={editFinished}
                cancelCallback={editFinished}
              />
            </Flyout>
          </div>
        </RenderInPortal>
      )}
    </div>
  );
}

export default ConditionsEdit;
