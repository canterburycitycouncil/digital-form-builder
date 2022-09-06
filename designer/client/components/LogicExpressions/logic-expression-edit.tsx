import "./logicExpressions.scss";

import { allInputs } from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import {
  hasValidationErrors,
  validateNotEmpty,
} from "@xgovformbuilder/designer/client/validations";
import { Input, Select } from "govuk-react-jsx";
import { LogicExpressionTypes } from "model/src";
import React, { useEffect, useState } from "react";

import { ValidationError } from "../FormComponent/componentReducer/componentReducer.validations";
import { ExpressionBuilder } from "./expression-builder";
import { LogicExpressionProps } from "./types";

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
  {
    children: "conditional",
    value: "conditional",
    "data-testid": "conditional",
  },
];

export const LogicExpressionEdit = ({
  data,
  save,
  logicExpression,
  onEdit,
  onCancel,
}: LogicExpressionProps) => {
  const [selectedExpression, setSelectedExpression] = useState(
    logicExpression.expressionType
  );
  const [labelName, setLabelName] = useState<string>(logicExpression.label);
  const [variableName, setVariableName] = useState<string>(
    logicExpression.variableName
  );
  // IS THIS THE DEFAULT?????
  const [expressionType, setExpressionType] = useState<LogicExpressionTypes>(
    "predefined"
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const logicExpressions = [];

  // CONDITIOPN RELATED STATE
  const [block, setBlock] = useState(0);
  const [testConditionSelect, setTestConditionSelect] = useState(() => []);
  const [testReturnSelect, setTestReturnSelect] = useState(() => []);
  const [currentCondition, setCurrentCondition] = useState(() => []);
  const [showNextBlock, setShowNextBlock] = useState(() => []);
  // const [currentBlock, setCurrentBlock] = useState(true);

  useEffect(() => {
    if (expressionType === "conditional") {
      buildConditionExpression();
    }
  });

  const addConditionalBlock = (event) => {
    let conditionBlock = (
      <React.Fragment>
        <div>
          <div
            className="govuk-form-group expression-conditional-block-extra"
            data-testid="conditional-block-additional"
          >
            <label
              className="govuk-label govuk-label--s"
              htmlFor="conditional-list"
            >
              Select a condition
            </label>
            <div className="govuk-form-group">
              <select
                className="govuk-select"
                id="conditional-list"
                onChange={(event) => conditionSelected(event)}
                data-testid="expression-condition"
              >
                <option>Please select</option>
                {conditionArray.map((condition, index) => {
                  if (currentCondition[index] !== condition.displayName) {
                    return (
                      <option
                        key={index}
                        value={condition.name}
                        data-testid={condition.name}
                      >
                        {condition.displayName}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-label--s"
                htmlFor="conditional-return"
              >
                TO RETURN
              </label>
            </div>
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-label--s"
                htmlFor="conditional-return"
              >
                Return field:
              </label>
              <select
                className="govuk-select"
                id="conditional-return"
                onChange={(event) => setReturn(event)}
                data-testid="expression-select-return"
              >
                <option>Please select</option>
                {fieldsForPath(data).map((field, index) => {
                  return (
                    <option
                      key={index}
                      value={field.children}
                      data-testid={field.children}
                    >
                      {field.children}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="govuk-form-group">
              <Input
                label={{
                  className: "govuk-label--s",
                  children: ["Or set a string to return:"],
                }}
                type="text"
                name="user-set-return"
                onBlur={(event) => setReturn(event)}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    setShowNextBlock(showNextBlock.concat(conditionBlock));
  };

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
      "expression-type",
      "chosen expression",
      "chosen expression",
      condition || selectedExpression,
      errors
    );

    setErrors(errors);

    return errors;
  };

  const onSave = (e) => {
    e.preventDefault();

    let validationErrors = validate();

    if (hasValidationErrors(validationErrors)) return;

    let dataCopy = { ...data };

    // NEED GENERIC EXPRESSION VAR - ONE THAT CAN BE USED TO POPULATE EXPRESSION VALUE IN OBJECT FOR ALL TYPES
    const logicExpressionObject = {
      label: labelName,
      variableName: variableName,
      expressionType: expressionType,
      expression: condition ? JSON.stringify(condition) : selectedExpression,
      // ^^^^^^^ NEED SORT THIS TO ENSURE A SINGLE VAR ^^^^^^^^
    };
    dataCopy?.logicExpressions?.push(logicExpressionObject);

    try {
      save(dataCopy, () => {
        onEdit();
      });
    } catch (err) {
      logger.error("ExpressionEdit", err);
    }
    console.log("ONSAVE - dataCopy:", dataCopy);
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

  let conditionArray = data.conditions;

  const conditionSelected = (conditionSelected) => {
    setTestConditionSelect([
      ...testConditionSelect,
      conditionSelected.target.value,
    ]);

    conditionArray.map((value, index) => {
      if (conditionSelected.target.value === value.name) {
        setCurrentCondition([...currentCondition, value.displayName]);
      }
    });
  };

  const fieldsForPath = (data) => {
    const inputs = allInputs(data);
    const fieldInputs = inputs.map((input) => {
      const label = input.title;
      return {
        children: label,
        value: input.name,
      };
    });
    return fieldInputs;
  };

  const handleElseIf = (event, id) => {
    event.preventDefault();
    // Add next conditional block
    addConditionalBlock();

    setBlock(id + 1);

    // IF handleElseIf IS HIT AND RETURN IS UNDEFINED ISSUE IS THAT IT IS MOVED UP ARRAY AND ASSIGNED TO THE WRONG SELECTION
    setTestReturnSelect([...testReturnSelect, testReturnSelect[id]]);
  };

  // Moved down to stay local to relevant functions
  let condition = {};
  let expressionBuilderObject = [];

  // Sets returns for blocks
  const setReturn = (event) => {
    event.preventDefault();
    let returnType =
      event.target.name === "user-set-return"
        ? event.target.value
        : `{${event.target.value}}`;
    setTestReturnSelect([...testReturnSelect, returnType]);
  };

  // Just sets the else return
  const setElseReturn = (event) => {
    event.preventDefault();
    console.log("ELSE RETURN:", event.target.value);
    expressionBuilderObject = Object.assign({}, ...expressionBuilderObject, {
      elsereturn: event.target.value,
    });
  };

  const buildConditionExpression = () => {
    // Build a paired array
    const conditionKeys = testConditionSelect;
    const conditionValues = testReturnSelect;

    let conditionsArray = conditionKeys.map((e, i) => [e, conditionValues[i]]);

    // LOOKS OK NOW (BUT THE INDEX ORDER MIGHT NEED LOOKING AT)
    conditionsArray &&
      conditionsArray.map((result, index) => {
        if (index === 0) {
          expressionBuilderObject.push({
            conditionId: result[0],
            return: result[1],
          });
        } else {
          // MIGHT BE AN ISSUE WITH HOW THE CONDITIONS ORDER ARE INDEXING?
          expressionBuilderObject[0]["else"] = {
            ...expressionBuilderObject[0],
            conditionId: result[0],
            return: result[1],
          };
        }
      });

    // console.log('expressionBuilderObject inside:', expressionBuilderObject)

    condition = Object.assign({}, ...expressionBuilderObject);

    // console.log('condition inside:', condition)
  };

  console.log("expressionBuilderObject:", expressionBuilderObject);

  // console.log('conditionArray', conditionArray)

  // console.log('data:', data)

  return (
    <div className="govuk-body">
      {hasValidationErrors(errors) && <ErrorSummary errorList={errors} />}
      {onCancel && (
        <a
          className="govuk-back-link"
          href="#"
          onClick={(e) => onCancel(e)}
          data-testid="expression-back"
        >
          Back
        </a>
      )}
      <Input
        label={{
          children: "Label",
        }}
        id="label-name"
        name="label-name"
        type="text"
        value={labelName}
        onChange={(e) => setLabelName(e.target.value)}
      />
      <Input
        label={{
          children: "Variable Name",
        }}
        id="variable-name"
        name="variable-name"
        type="text"
        value={variableName}
        onChange={(e) => setVariableName(e.target.value)}
        data-testid="expression-variable-name"
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
        onChange={(e) => setExpressionType(e.target.value)}
        data-testid="expression-select"
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
            children: [i18n("logicExpression.predefinedExpressions.helpText")],
          }}
          name="predefined-expressions"
          onChange={(e) => setSelectedExpression(e.target.value)}
        />
      ) : expressionType === "conditional" ? (
        <React.Fragment>
          {/* SINGLE DROPDOWN FOR ANY/ALL CONDITION */}
          {currentCondition && (
            <div className="govuk-form-group">
              <label>CURRENT EXPRESSION: IF:</label>
              {currentCondition.map((condition, index) => {
                return (
                  <span key={index}>
                    {index > 0 && <span> elseif </span>} {condition}
                  </span>
                );
              })}
            </div>
          )}
          <div className="govuk-form-group" data-testid="conditional-block">
            <label
              className="govuk-label govuk-label--s"
              htmlFor="conditional-list"
            >
              Select a condition
            </label>
            <div className="govuk-form-group">
              <select
                className="govuk-select"
                id="conditional-list"
                onChange={(event) => conditionSelected(event)}
                data-testid="expression-condition"
              >
                <option>Please select</option>
                {conditionArray.map((condition, index) => {
                  if (currentCondition[index] !== condition.displayName) {
                    return (
                      <option
                        key={index}
                        value={condition.name}
                        data-testid={condition.name}
                      >
                        {condition.displayName}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-label--s"
                htmlFor="conditional-return"
              >
                TO RETURN
              </label>
            </div>
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-label--s"
                htmlFor="conditional-return"
              >
                Return field:
              </label>
              <select
                className="govuk-select"
                id="conditional-return"
                onChange={(event) => setReturn(event)}
                data-testid="expression-select-return"
              >
                <option>Please select</option>
                {fieldsForPath(data).map((field, index) => {
                  return (
                    <option
                      key={index}
                      value={field.children}
                      data-testid={field.children}
                    >
                      {field.children}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="govuk-form-group">
              <Input
                label={{
                  className: "govuk-label--s",
                  children: ["Or set a string to return:"],
                }}
                type="text"
                name="user-set-return"
                onBlur={(event) => setReturn(event)}
              />
            </div>
          </div>
          <div>
            {showNextBlock}
            {conditionArray.length > testConditionSelect.length && (
              <div className="govuk-form-group">
                <button
                  className="govuk-button"
                  name="button-elseif"
                  data-testid="button-elseif"
                  onClick={(event) => handleElseIf(event, block)}
                >
                  Else If
                </button>
              </div>
            )}
            <div className="govuk-form-group">
              <Input
                label={{
                  children: ["Else Return:"],
                  className: "govuk-label--s",
                }}
                type="text"
                name="user-set-else-return"
                onBlur={(event) => setElseReturn(event)}
                data-testid="expression-else-return"
              />
            </div>
          </div>
        </React.Fragment>
      ) : (
        <ExpressionBuilder
          expression={selectedExpression}
          expressionType={expressionType}
          onExpressionChange={setSelectedExpression}
        />
      )}
      <div className="govuk-form-group">
        <button
          className="govuk-button"
          data-testid="expression-save-button"
          onClick={(e) => onSave(e)}
        >
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
  );
};
