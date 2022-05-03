import { FormDefinition } from "@xgovformbuilder/data-model";
import { DataContext } from "designer/client/context";
import { camelCase } from "designer/client/helpers";
import logger from "designer/client/plugins/logger";
import React from "react";

import { addSection } from "./data/addSection";

interface State {
  name: string;
  title: string;
  generatedName: string;
}

interface Props {
  onCreate: (data: FormDefinition) => void;
  onCancel: (e: any) => void;
  data: FormDefinition;
}

class SectionCreate extends React.Component<Props, State> {
  static contextType = DataContext;
  state: State = {
    name: "",
    title: "",
    generatedName: "",
  };

  async onSubmit(e) {
    e.preventDefault();
    const { data, save } = this.context;
    const { name, title, generatedName } = this.state;
    const updated = addSection(data, {
      name: name ?? generatedName,
      title: title?.trim(),
    });

    try {
      const savedData = await save(updated);
      this.props.onCreate(savedData);
    } catch (err) {
      logger.error("SectionCreate", err);
    }
  }

  onBlurName = (e) => {
    const input = e.target;
    const newName = input.value.trim();
    const { data } = this.props;

    // Validate it is unique
    if (data.sections.find((s) => s.name === newName)) {
      input.setCustomValidity(`Name '${newName}' already exists`);
    } else {
      input.setCustomValidity("");
    }
    this.setState({
      name: newName,
    });
  };

  onChangeTitle = (e) => {
    const input = e.target;
    const { data } = this.props;
    const newTitle = input.value;
    const generatedName = camelCase(newTitle).trim();
    let newName = generatedName;

    let i = 1;
    while (data.sections.find((s) => s.name === newName)) {
      newName = generatedName + i;
      i++;
    }

    this.setState({
      generatedName: newName,
      title: newTitle,
    });
  };

  render() {
    const { title, name, generatedName } = this.state;
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
          <label className="govuk-label govuk-label--s" htmlFor="section-title">
            Title
          </label>
          <span className="govuk-hint">
            The text displayed on the page above the main title.
          </span>
          <input
            className="govuk-input"
            id="section-title"
            name="title"
            type="text"
            required
            value={title || ""}
            onChange={this.onChangeTitle}
          />
        </div>
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="section-name">
            Name
          </label>
          <span className="govuk-hint">
            This is used as a namespace in the JSON output for all pages in this
            section. Use `camelCasing` e.g. checkBeforeStart or personalDetails.
          </span>
          <input
            className="govuk-input"
            id="section-name"
            name="name"
            type="text"
            required
            pattern="^\S+"
            defaultValue={name || generatedName || ""}
            onBlur={this.onBlurName}
          />
        </div>

        <button className="govuk-button" type="submit">
          Save
        </button>
      </form>
    );
  }
}

export default SectionCreate;
