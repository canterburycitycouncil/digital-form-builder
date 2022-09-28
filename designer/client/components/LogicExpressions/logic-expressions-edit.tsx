import { LogicExpressionEdit } from "@xgovformbuilder/designer/client/components/LogicExpressions";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { FormDefinition, LogicExpression } from "@xgovformbuilder/model";
import React, { useContext, useState } from "react";

import { Flyout } from "../Flyout";
import { RenderInPortal } from "../RenderInPortal";

export const LogicExpressionsEdit = () => {
  const { data, save } = useContext(DataContext);
  const [
    logicExpression,
    setLogicExpression,
  ] = useState<LogicExpression | null>(null);
  const [logicExpressionIndex, setLogicExpressionIndex] = useState<
    number | null
  >(null);
  const [showAddExpression, setShowAddExpression] = useState(false);

  const logicExpressions = data?.logicExpressions;

  const onClickExpression = (
    event,
    expression: LogicExpression,
    index: number
  ) => {
    event.preventDefault();
    setLogicExpression(expression);
    setLogicExpressionIndex(index);
    setShowAddExpression(true);
  };

  const onClickAddExpression = (e) => {
    e.preventDefault();
    setLogicExpression({
      label: "new logic expression",
      expressionType: "predefined",
      variableName: "",
      expression: "{number_of_rooms} * 500",
    });
    setShowAddExpression(true);
  };

  const handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowAddExpression(false);
    setLogicExpression(null);
  };

  const handleEdit = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    setShowAddExpression(false);
    setLogicExpression(null);
  };

  return (
    <div className="govuk-body">
      {!logicExpression ? (
        <>
          {showAddExpression ? (
            <RenderInPortal>
              <Flyout>
                <LogicExpressionEdit
                  data={data as FormDefinition}
                  save={save}
                  logicExpression={
                    (logicExpression as unknown) as LogicExpression
                  }
                  logicExpressionIndex={
                    (data as FormDefinition).logicExpressions.length
                  }
                  onEdit={() => setShowAddExpression(false)}
                  onCancel={() => setShowAddExpression(false)}
                />
              </Flyout>
            </RenderInPortal>
          ) : (
            <ul className="govuk-list">
              {(logicExpressions || []).map((expression, index) => (
                <li key={expression.label}>
                  <a
                    href="#"
                    onClick={(e) => onClickExpression(e, expression, index)}
                  >
                    {expression.label}
                  </a>
                </li>
              ))}
              <li>
                <hr />
                <a href="#" onClick={(e) => onClickAddExpression(e)}>
                  Add logic expression
                </a>
              </li>
            </ul>
          )}
        </>
      ) : (
        <RenderInPortal>
          <Flyout>
            <LogicExpressionEdit
              logicExpression={logicExpression}
              logicExpressionIndex={logicExpressionIndex as number}
              data={data as FormDefinition}
              save={save}
              onEdit={(e: Event) => handleEdit(e)}
              onCancel={(e: Event) => handleCancel(e)}
            />
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  );
};
