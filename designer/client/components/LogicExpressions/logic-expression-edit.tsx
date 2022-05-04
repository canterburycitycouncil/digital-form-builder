import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { ValidationErrors } from "@xgovformbuilder/designer/client/pages/Outputs/outputs/types";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import {
  hasValidationErrors,
  validateNotEmpty,
} from "@xgovformbuilder/designer/client/validations";
import { Input, Select } from "govuk-react-jsx";
import React, { useState } from "react";

import { LogicExpressionProps } from "./types";

export const LogicExpressionEdit = ({
  data,
  save,
  logicExpression,
  onEdit,
  onCancel,
}: LogicExpressionProps) => {
  const [selectedExpression, setSelectedExpression] = useState(
    logicExpression.expression
  );
  const [labelName, setLabelName] = useState<string>(logicExpression.label);
  const [variableName, setVariableName] = useState<string>(
    logicExpression.variableName
  );
  const [errors, setErrors] = useState<{}>({});
  const logicExpressions = [
    {
      children: "logic expression one",
      value: "{number_of_rooms} * 500",
    },
    {
      children: "logic expression two",
      value: "{number_of_rooms} * 1000",
    },
    {
      children: "logic expression three",
      value: "{number_of_rooms} * 2000",
    },
  ];

  const validate = () => {
    const errors: ValidationErrors = {};

    validateNotEmpty(
      "label-name",
      "expression label",
      "label",
      labelName,
      errors
    );

    validateNotEmpty(
      "variable-name",
      "expression variable name",
      "variable name",
      variableName,
      errors
    );

    validateNotEmpty(
      "select-1",
      "chosen expression",
      "chosen expression",
      selectedExpression,
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
    const logicExpressionObject = {
      label: labelName,
      variableName: variableName,
      expression: selectedExpression as any,
    };
    dataCopy?.logicExpressions?.push(logicExpressionObject);
    try {
      save(dataCopy, () => {
        onEdit();
      });
    } catch (err) {
      logger.error("ExpressionEdit", err);
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

  return (
    <div className="govuk-body">
      {hasValidationErrors(errors) && (
        <ErrorSummary errorList={Object.values(errors)} />
      )}
      {onCancel && (
        <a className="govuk-back-link" href="#" onClick={(e) => onCancel(e)}>
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
      />
      <Select
        id="select-1"
        items={logicExpressions}
        label={{
          children: "Label text goes here",
        }}
        name="select-1"
        value={selectedExpression}
        onChange={(e) => setSelectedExpression(e.target.value)}
      />
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
  );
};
