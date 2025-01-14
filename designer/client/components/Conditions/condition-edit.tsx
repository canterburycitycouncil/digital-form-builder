import { DataContext } from "@xgovformbuilder/designer/client/context";
import Editor from "@xgovformbuilder/designer/client/editor";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { ConditionsWrapper, FormDefinition } from "@xgovformbuilder/model";
import React from "react";

import { removeCondition, updateCondition } from "./data";

interface Props {
  data: FormDefinition;
  onEdit: ({ data }) => void;
  onCancel: (e) => void;
  condition: any;
}

interface State {
  displayName: string;
  value: string;
}

class ConditionEdit extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      displayName: props.condition.displayName,
      value: props.condition.value,
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { save } = this.context;
    const displayName = this.state.displayName;
    const newValue = this.state.value;
    const { data, condition } = this.props;

    const updated = updateCondition(data, condition.name, {
      displayName,
      value: newValue,
    });

    try {
      const saved = await save(updated);
      this.props.onEdit({ data: saved });
    } catch (err) {
      logger.error("ConditionEdit", err);
    }
  };

  onClickDelete = async (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { data, save } = this.context;
    const { condition } = this.props;

    // Remove the condition
    const updatedData = removeCondition(data, condition.name);
    try {
      await save(updatedData);
      this.props.onEdit({ data });
    } catch (e) {
      logger.error("ConditionEdit", e);
    }
  };

  onBlurName = (e) => {
    const input = e.target;
    const { data, condition } = this.props;
    const newName = input.value.trim();

    // Validate it is unique
    if (
      data.conditions.find(
        (s) => s.name !== condition.name && s.displayName === newName
      )
    ) {
      input.setCustomValidity(`Display name '${newName}' already exists`);
    } else {
      input.setCustomValidity("");
    }

    this.setState({
      displayName: newName,
    });
  };

  onValueChange = (value) => {
    this.setState({
      value: value,
    });
  };

  render() {
    const { condition } = this.props;
    const wrappedCondition = new ConditionsWrapper(condition);

    return (
      <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
        <a
          className="govuk-back-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            this.props.onCancel(e);
          }}
        >
          Back
        </a>
        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="condition-name"
          >
            Display name
          </label>
          <input
            className="govuk-input"
            id="condition-name"
            name="displayName"
            type="text"
            defaultValue={condition.displayName}
            required
            onBlur={this.onBlurName}
          />
        </div>
        <div className="govuk-form-group">
          <label
            className="govuk-label govuk-label--s"
            htmlFor="condition-value"
          >
            Value
          </label>
          <Editor
            id="condition-edit"
            name="value"
            required
            value={wrappedCondition.expression}
            valueCallback={this.onValueChange}
          />
        </div>
        <button className="govuk-button" type="submit">
          Save
        </button>{" "}
        <button
          className="govuk-button"
          type="button"
          onClick={this.onClickDelete}
        >
          Delete
        </button>
      </form>
    );
  }
}

export default ConditionEdit;
