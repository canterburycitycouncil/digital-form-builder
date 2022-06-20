import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { ValidationErrors } from "@xgovformbuilder/designer/client/pages/Outputs/outputs/types";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import {
  hasValidationErrors,
  validateNotEmpty,
} from "@xgovformbuilder/designer/client/validations";
import { Input, Select } from "govuk-react-jsx";
import { LogicExpressionTypes } from "model/src";
import React, { useState } from "react";

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
];

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
  const [expressionType, setExpressionType] = useState<LogicExpressionTypes>(
    "predefined"
  );
  const [errors, setErrors] = useState<{}>({});
  const logicExpressions = [];

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
      expressionType: expressionType,
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
          value={selectedExpression}
          onChange={(e) => setSelectedExpression(e.target.value)}
        />
      ) : expressionType === "conditional" ? (
        ""
      ) : (
        <ExpressionBuilder
          expression={selectedExpression}
          expressionType={expressionType}
          onExpressionChange={setSelectedExpression}
        />
      )}
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
