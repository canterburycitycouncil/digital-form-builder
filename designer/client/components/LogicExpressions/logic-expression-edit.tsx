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
  editingToggle: boolean;
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
  {},
];

const predefinedLogicExpressions = [
  {
    children: "logic expression 1",
    value: "{number_of_rooms} * 500",
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
    expressionType: logicExpression.expressionType,
    logicExpression: "",
    expressions: [],
    errors: [],
    editingToggle: false,
  });

  const {
    selectedExpression,
    labelName,
    variableName,
    expressionType,
    errors,
    expressions,
    editingToggle,
  } = expressionState;

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

  // go through the expressions state which holds the expression, but in seperate objects. Data should be in the content field. Turn into new expression on the LogicExpressions object.

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
    const logicExpressionObject = {
      label: labelName,
      variableName: variableName,
      expressionType: expressionType,
      expression: selectedExpression as any,
    };
    if (logicExpressionIndex !== null) {
      dataCopy?.logicExpressions.splice(
        logicExpressionIndex,
        1,
        logicExpressionObject
      );
      try {
        save(dataCopy, () => {
          onEdit();
        });
      } catch (err) {
        logger.error("ExpressionEdit", err);
      }
    } else {
      dataCopy?.logicExpressions.push(logicExpressionObject);
      try {
        save(dataCopy, () => {
          onEdit();
        });
      } catch (err) {
        logger.error("ExpressionEdit", err);
      }
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

  useEffect(() => {
    if (logicExpression.expression) {
      setExpressionState({
        ...expressionState,
        editingToggle: !editingToggle,
      });
    }
  }, [logicExpression.expression]);

  return (
    <>
      <div className="govuk-body">
        {hasValidationErrors(errors) && <ErrorSummary errorList={errors} />}
        {onCancel && (
          <a className="govuk-back-link" href="#" onClick={(e) => onCancel(e)}>
            Back
          </a>
        )}

        {logicExpression.expression ? (
          <div
            className="govuk-notification-banner govuk-notification-banner--success"
            role="alert"
          >
            <div className="govuk-notification-banner__header">
              <h2
                className="govuk-notification-banner__title"
                id="govuk-notification-banner-title"
              >
                Saved Expression
                {/* {logicExpression.label} */}
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <h3 className="govuk-notification-banner__heading">
                {logicExpression.expression}
              </h3>
              <p className="govuk-body">
                <button
                  className="govuk-button"
                  onClick={(e) =>
                    setExpressionState({
                      ...expressionState,
                      editingToggle: !editingToggle,
                    })
                  }
                >
                  Edit
                </button>
              </p>
            </div>
          </div>
        ) : null}
        {!editingToggle ? (
          <>
            <Input
              label={{
                children: "Label Name",
                className: "govuk-label govuk-label--s",
              }}
              hint={{
                children: [i18n("logicExpression.newExpression.labelHint")],
              }}
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
              value={expressionType || ""}
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
                items={predefinedLogicExpressions}
                label={{
                  className: "govuk-label--s",
                  children: [
                    i18n("logicExpression.predefinedExpressions.title"),
                  ],
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
            ) : expressionType === "mathematical" ? (
              <InputActions
                expressionState={expressionState}
                setExpressionState={setExpressionState}
              />
            ) : expressionType === "literal" ? (
              <InputActions
                expressionState={expressionState}
                setExpressionState={setExpressionState}
              />
            ) : null}
          </>
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
