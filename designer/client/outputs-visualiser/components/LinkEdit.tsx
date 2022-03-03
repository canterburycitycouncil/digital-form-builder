import React from "react";
import { FormDefinition } from "@xgovformbuilder/model";

import { DataContext } from "../../context";
import { findOutput } from "../../data/output";
import { updateLink } from "../../data/output";
import logger from "../../plugins/logger";
import { Edge } from "../../components/Visualisation/getLayout";
import { Output, responses } from "../../outputs/types";

interface Props {
  edge: Edge;
  data: FormDefinition;
  onEdit: Function;
}

interface State {
  output: Output;
  link: string;
  previousValues: string[];
}

class LinkEdit extends React.Component<Props> {
  static contextType = DataContext;

  state: State;

  constructor(props, context) {
    super(props, context);
    const { data } = this.context;
    const { edge } = this.props;
    const [output] = findOutput(data, edge.source);
    const toOutput = findOutput(data, edge.target)[0];
    const previousValues = toOutput.previousValues;
    const link = output.next.find((n) => n === edge.target) ?? "";

    this.state = {
      output: output,
      link: link,
      previousValues: previousValues,
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { link, output } = this.state;
    const { data, save } = this.context;
    const updatedData = updateLink(data, output.name, link);

    try {
      await save(updatedData);
      this.props.onEdit();
    } catch (err) {
      logger.error("LinkEdit", err);
    }
  };

  onClickDelete = (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { link, output } = this.state;
    const { data, save } = this.context;

    const copy = { ...data };
    const [copyOutput] = findOutput(data, output.name);
    const copyLinkIdx = copyOutput.next.findIndex((n) => n === link);
    copyOutput.next.splice(copyLinkIdx, 1);
    copy.outputs = copy.outputs.map((output) =>
      output.name === copyOutput.name ? copyOutput : output
    );

    save(copy)
      .then((data) => {
        this.props.onEdit({ data });
      })
      .catch((err) => {
        logger.error("LinkEdit", err);
      });
  };

  onChangePrevious = (e) => {
    const name = e.target.value;
    const { data } = this.props;
    const [output] = findOutput(data, name);
    this.setState({
      output: output,
    });
  };

  onChangePreviousValues = (e) => {
    let previousValuesCopy = [...this.state.previousValues];
    if (
      !e.target.checked &&
      this.state.previousValues.findIndex(
        (value) => value === e.target.name.replace("previousValues.", "")
      ) > -1
    ) {
      let index = this.state.previousValues.findIndex(
        (value) => value === e.target.name.replace("previousValues.", "")
      );
      previousValuesCopy.splice(index, 1);
    } else if (
      e.target.checked &&
      this.state.previousValues.findIndex(
        (value) => value === e.target.name.replace("previousValues.", "")
      ) === -1
    ) {
      previousValuesCopy.push(e.target.name.replace("previousValues.", ""));
    }
    this.setState({
      previousValues: previousValuesCopy,
    });
  };

  getValuesForPreviousOutput = () => {
    const { output } = this.state;
    const previousOutputType = output.type;
    let responseFormat = responses[previousOutputType];
    return (
      <div className="govuk-form-group">
        <label className="govuk-label">Previous output values</label>
        <span className="govuk-hint">
          Choose which values are needed for processing this output
        </span>
        <div className="govuk-form-group govuk-checkboxes">
          {Object.keys(responseFormat).map((property) => (
            <div
              className="govuk-checkboxes__item"
              key={`response-value-${property}`}
            >
              <input
                type="checkbox"
                className={`govuk-checkboxes__input`}
                id={`field-previousValues-${property}`}
                name={`previousValues.${property}`}
                checked={
                  this.state.previousValues.findIndex(
                    (value) => value === property
                  ) > -1
                }
                onChange={this.onChangePreviousValues}
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor={`field-previousValues-${property}`}
              >
                {property}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { data, edge } = this.props;
    const { outputs } = data;
    const { output } = this.state;

    return (
      <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="link-source">
            From
          </label>
          <select
            value={edge.source}
            className="govuk-select"
            id="link-source"
            disabled
          >
            <option />
            {outputs.map((output) => (
              <option key={output.name} value={output.name}>
                {output.title}
              </option>
            ))}
          </select>
        </div>
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="link-target">
            To
          </label>
          <select
            value={edge.target}
            className="govuk-select"
            id="link-target"
            onChange={this.onChangePrevious}
            disabled
          >
            <option />
            {outputs.map((output) => (
              <option key={output.name} value={output.name}>
                {output.title}
              </option>
            ))}
          </select>
        </div>
        {output && this.getValuesForPreviousOutput}
        <button className="govuk-button" type="submit">
          Save
        </button>
        &nbsp;
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

export default LinkEdit;
