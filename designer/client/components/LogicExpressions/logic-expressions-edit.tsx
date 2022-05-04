import { LogicExpressionEdit } from "@xgovformbuilder/designer/client/components/LogicExpressions";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { LogicExpression } from "@xgovformbuilder/model/src";
import React, { useContext, useState } from "react";

export const LogicExpressionsEdit = () => {
  const { data, save } = useContext(DataContext);
  const [
    logicExpression,
    setLogicExpression,
  ] = useState<LogicExpression | null>(null);
  const [showAddExpression, setShowAddExpression] = useState(false);

  const logicExpressions = data.logicExpressions;

  const onClickExpression = (event, expression) => {
    event.preventDefault();
    setLogicExpression(expression);
    setShowAddExpression(true);
  };

  const onClickAddExpression = (e) => {
    e.preventDefault();
    setLogicExpression({
      label: "new logic expression",
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
    <div>
      {!logicExpression ? (
        <div>
          {showAddExpression ? (
            <LogicExpressionEdit
              data={data}
              save={save}
              logicExpression={(logicExpression as unknown) as LogicExpression}
              onEdit={() => setShowAddExpression(false)}
              onCancel={() => setShowAddExpression(false)}
            />
          ) : (
            <ul className="govuk-list">
              {(logicExpressions || []).map((expression) => (
                <li key={expression.label}>
                  <a href="#" onClick={(e) => onClickExpression(e, expression)}>
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
        </div>
      ) : (
        <LogicExpressionEdit
          logicExpression={logicExpression}
          data={data}
          save={save}
          onEdit={(e: Event) => handleEdit(e)}
          onCancel={(e: Event) => handleCancel(e)}
        />
      )}
    </div>
  );
};
