import { i18n } from "@xgovformbuilder/designer/client/i18n";
import {
  clone,
  Condition,
  ConditionField,
  ConditionRef,
  conditionValueFrom,
  getOperatorNames,
} from "@xgovformbuilder/model";
import React from "react";
import Select from "react-select";

import { FieldInputObject } from "./InlineConditions";
import { InlineConditionsDefinitionValue } from "./InlineConditionsDefinitionValue";

function isCondition(fieldDef) {
  return fieldDef?.type === "Condition";
}

interface blankObject {
  [key: string]: any;
}
interface Props {
  expectsCoordinator: boolean;
  condition?: Condition;
  fields: FieldInputObject;
  saveCallback: (condition: Condition | ConditionRef) => void;
  conditionsChange?: (e) => void;
}

interface State {
  condition: Condition;
}

class InlineConditionsDefinition extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      condition: clone(props.condition) || {},
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.expectsCoordinator !== prevProps.expectsCoordinator ||
      this.props.fields !== prevProps.fields
    ) {
      const { condition } = this.state;
      const newCondition = this.props.fields[condition?.field?.name]
        ? this.state.condition
        : {};
      this.setState(
        {
          condition: newCondition,
        },
        () => {}
      );
    }
  }

  onChangeCoordinator = (selected) => {
    const input = selected;

    let newCondition: blankObject = {};

    if (input.value && input.value.trim() !== "") {
      newCondition = clone(this.state.condition ?? {});
      newCondition.coordinator = input.value;
    }
    this.setState(
      {
        condition: newCondition,
      },
      () => {}
    );
  };

  onClickFinalise = () => {
    const { condition } = this.state;
    this.setState(
      {
        condition: {},
      },
      () => {}
    );

    const fieldDef = this.props.fields[condition.field.name];
    if (isCondition(fieldDef)) {
      this.props.saveCallback(
        new ConditionRef(fieldDef.name, fieldDef.label, condition.coordinator)
      );
    } else {
      this.props.saveCallback(
        new Condition(
          ConditionField.from(condition.field),
          condition.operator,
          conditionValueFrom(condition.value),
          condition.coordinator
        )
      );
    }
  };

  onChangeField = (e) => {
    const input = e;
    const fieldName = input.value;

    const { condition } = this.state;
    const currentField = condition.field?.name;
    const currentOperator = condition.operator;
    const fieldDef = this.props.fields[fieldName];

    this._updateCondition(condition, (c) => {
      if (fieldName) {
        if (isCondition(fieldDef)) {
          delete c.value;
          delete c.operator;
        } else {
          if (
            currentField &&
            this.props.fields[currentField].values !== fieldDef.values
          ) {
            delete c.value;
          }
          if (
            currentOperator &&
            !getOperatorNames(fieldName).includes(currentOperator)
          ) {
            delete c.operator;
          }
        }
        c.field = {
          name: fieldName,
          display: fieldDef.label,
          type: fieldDef.type,
        };
      } else {
        delete c.field;
        delete c.operator;
        delete c.value;
      }
    });
  };

  _updateCondition(condition, updates) {
    const copy = clone(condition);
    updates(copy);
    this.setState(
      {
        condition: copy,
      },
      () => {}
    );
  }

  onChangeOperator = (selected) => {
    const input = selected;

    const { condition } = this.state;
    this._updateCondition(condition, (c) => {
      c.operator = input.value;
    });
  };

  updateValue = (newValue) => {
    const { condition } = this.state;
    this._updateCondition(condition, (c) => {
      c.value = newValue;
    });
  };

  setState(state, callback) {
    if (
      (state.conditions || state.selectedCondition !== undefined) &&
      this.props.conditionsChange
    ) {
      this.props.conditionsChange(state.conditions);
    }
    super.setState(state, callback);
  }

  render() {
    const { expectsCoordinator, fields } = this.props;
    const { condition } = this.state;
    const fieldDef = fields[condition.field?.name];
    const followUpOptions = [
      {
        label: "and",
        key: "and",
        value: "and",
      },
      {
        label: "or",
        key: "or",
        value: "or",
      },
    ];

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "black" : "black",
        backgroundColor: state.isFocused ? "#999999" : null,
      }),
      control: (provided) => ({
        ...provided,
        border: 0,
        boxShadow: "none",
      }),
      container: (provided) => ({
        ...provided,
        height: "auto",
        width: "auto",
      }),
    };

    return (
      <div className="govuk-form-group" id="condition-definition-group">
        {expectsCoordinator && (
          <div className="govuk-form-group">
            <Select
              className="govuk-select"
              id="cond-coordinator"
              name="cond-coordinator"
              placeholder={i18n("conditions.additionalCriteria")}
              options={followUpOptions}
              onChange={this.onChangeCoordinator}
              styles={customStyles}
            />
          </div>
        )}

        {(condition.coordinator || !expectsCoordinator) && (
          // <div id="condition-definition-inputs">
          <div className="govuk-form-group">
            <Select
              className="govuk-select"
              placeholder={i18n("conditions.startTyping")}
              id="cond-field"
              name="cond-field"
              styles={customStyles}
              options={
                Object.values(this.props.fields).map((field) => ({
                  label: field.label,
                  value: field.name,
                  type: field.type,
                })) ?? [{ label: "", value: "" }]
              }
              onChange={this.onChangeField}
            />

            {fieldDef && !isCondition(fieldDef) && (
              <Select
                className="govuk-select"
                placeholder={i18n("conditions.startTyping")}
                id="cond-operator"
                name="cond-operator"
                options={
                  getOperatorNames(fieldDef.type).map((conditional) => ({
                    label: conditional,
                    value: conditional,
                  })) ?? [{ label: "", value: "" }]
                }
                styles={customStyles}
                onChange={this.onChangeOperator}
              />
            )}

            {condition.operator && (
              <InlineConditionsDefinitionValue
                fieldDef={fieldDef}
                value={condition.value}
                operator={condition.operator}
                updateValue={this.updateValue}
              />
            )}
            {(condition.value || isCondition(fieldDef)) && (
              <div className="govuk-form-group">
                <a
                  id="save-inline-conditions"
                  className="govuk-link"
                  onClick={this.onClickFinalise}
                >
                  {i18n("add")}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default InlineConditionsDefinition;
