import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import {
  hasValidationErrors,
  validateNotEmpty,
} from "@xgovformbuilder/designer/client/validations";
import { LogicExpressionTypes } from "@xgovformbuilder/model";
import { Input, Select } from "govuk-react-jsx";
import React, { useEffect, useState } from "react";

import { ValidationError } from "../FormComponent/componentReducer/componentReducer.validations";
import InputActions from "./input-actions";
import { LogicExpressionProps } from "./types";

export interface ExpressionState {
  selectedExpression: any;
  labelName: string;
  variableName: string;
  expressionType: LogicExpressionTypes;
  errors: ValidationError[];
  logicExpression: string;
  expressions: [];
}

const expressionTypes = [
  {
    children: "predefined",
    value: "predefined",
  },
  {
    children: "literal",
    value: "literal",
  },
  {
    children: "mathematical",
    value: "mathematical",
  },
];

export const LogicExpressionEdit = ({
  data,
  save,
  logicExpression,
  logicExpressionIndex,
  onEdit,
  onCancel,
}: LogicExpressionProps) => {
  const [expressionState, setExpressionState] = useState<ExpressionState>({
    selectedExpression: logicExpression.expression,
    labelName: logicExpression.label,
    variableName: logicExpression.variableName,
    expressionType: "predefined",
    logicExpression: logicExpression.expression,
    expressions: [],
    errors: [],
  });

  console.log(data);

  console.log("expression state", expressionState);

  const {
    selectedExpression,
    labelName,
    variableName,
    expressionType,
    errors,
    expressions,
  } = expressionState;

  console.log("selected expression", selectedExpression);

  const logicExpressions = [
    {
      children: "logic expression 1",
      value: "{number_of_rooms} * 500",
    },
  ];

  const validate = () => {
    const errors: ValidationError[] = [];

    validateNotEmpty("label-name", "expression label", labelName, errors);

    validateNotEmpty(
      "variable-name",
      "expression variable name",
      variableName,
      errors
    );

    validateNotEmpty(
      "select-1",
      "chosen expression",
      selectedExpression,
      errors
    );

    setExpressionState({ ...expressionState, errors: errors });

    return errors;
  };

  function getNewIndex(logicExpressions) {
    return logicExpressions.length;
    // Math.max(...arr)
  }

  console.log(getNewIndex(logicExpressions));

  /// go through the expressions state which holds the expression, but in seperate objects. Data should be in the content field. Turn into new expression on the LogicExpressions object.

  const cleanBuilderSelection = (expressions) => {
    const cleanExpression = expressions.map(
      (singleExpression) => singleExpression.content
    );
    return cleanExpression.join(" ");
  };

  const onSave = (e) => {
    e.preventDefault();
    let validationErrors = validate();
    if (hasValidationErrors(validationErrors)) return;
    let dataCopy = { ...data };
    console.log("data copy", dataCopy);
    const logicExpressionObject = {
      label: labelName,
      variableName: variableName,
      expressionType: expressionType,
      expression: selectedExpression as any,
    };
    console.log(logicExpressionObject);
    if (dataCopy?.logicExpressions) {
      dataCopy.logicExpressions[
        getNewIndex(logicExpressions)
      ] = logicExpressionObject;
      try {
        save(dataCopy, () => {
          onEdit();
        });
      } catch (err) {
        logger.error("ExpressionEdit", err);
      }
    } else {
      logger.error(
        "ExpressionEdit",
        "Could not find a list of logic expressions on the form definition"
      );
    }
  };

  const onClickDelete = (e) => {
    e.preventDefault();
    if (!window.confirm("Confirm delete")) {
      return;
    }
    const copy = { ...data };
    const expressionIndex = data.logicExpressions.indexOf(logicExpression);
    if (expressionIndex >= 0) {
      copy.logicExpressions.splice(expressionIndex, 1);
      try {
        save(copy, () => {
          onEdit();
        });
      } catch (err) {
        logger.error("ExpressionEdit", err);
      }
    } else {
      onEdit();
    }
  };

  useEffect(() => {
    setExpressionState({
      ...expressionState,
      selectedExpression: cleanBuilderSelection(expressions),
    });
  }, [expressions]);

  // console.log("logic expressions", expressions);

  return (
    <>
      <div className="govuk-body">
        {hasValidationErrors(errors) && <ErrorSummary errorList={errors} />}
        {onCancel && (
          <a className="govuk-back-link" href="#" onClick={(e) => onCancel(e)}>
            Back
          </a>
        )}
        <Input
          label={{
            children: "Label Name",
            className: "govuk-label govuk-label--s",
          }}
          hint={{ children: [i18n("logicExpression.newExpression.labelHint")] }}
          id="label-name"
          name="label-name"
          type="text"
          value={labelName}
          onChange={(e) =>
            setExpressionState({
              ...expressionState,
              labelName: e.target.value,
            })
          }
        />
        <Input
          label={{
            children: "Variable Name",
            className: "govuk-label govuk-label--s",
          }}
          hint={{
            children: [i18n("logicExpression.newExpression.variableHint")],
          }}
          id="variable-name"
          name="variable-name"
          type="text"
          value={variableName}
          onChange={(e) =>
            setExpressionState({
              ...expressionState,
              variableName: e.target.value,
            })
          }
        />
        <Select
          id="expression-type"
          items={expressionTypes}
          label={{
            className: "govuk-label--s",
            children: [i18n("logicExpression.expressionTypes.title")],
          }}
          hint={{
            children: [i18n("logicExpression.expressionTypes.helpText")],
          }}
          name="predefined-expressions"
          value={expressionType}
          onChange={(e) =>
            setExpressionState({
              ...expressionState,
              expressionType: e.target.value,
            })
          }
        />
        {expressionType === "predefined" ? (
          <Select
            id="predefined-expressions"
            items={logicExpressions}
            label={{
              className: "govuk-label--s",
              children: [i18n("logicExpression.predefinedExpressions.title")],
            }}
            hint={{
              children: [
                i18n("logicExpression.predefinedExpressions.helpText"),
              ],
            }}
            name="predefined-expressions"
            value={selectedExpression}
            onChange={(e) =>
              setExpressionState({
                ...expressionState,
                selectedExpression: e.target.value,
              })
            }
          />
        ) : expressionType === "mathematical" || "literal" ? (
          <InputActions
            expressionState={expressionState}
            setExpressionState={setExpressionState}
          />
        ) : null}
        <div className="govuk-form-group">
          <button className="govuk-button" onClick={(e) => onSave(e)}>
            save
          </button>
        </div>
        {logicExpression && (
          <div className="govuk-form-group">
            <a onClick={(e) => onClickDelete(e)} href="#">
              Delete
            </a>
          </div>
        )}
      </div>
    </>
  );
};
