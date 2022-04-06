import React from "react";
import { Input } from "@xgovformbuilder/govuk-react-jsx";
import { clone } from "@xgovformbuilder/model";
import randomId from "../../../randomId";
import { withI18n, WithI18nProps } from "../../../i18n";
import ErrorSummary from "../../../error-summary";
import { validateTitle, hasValidationErrors } from "../../../validations";
import { DataContext } from "../../../context";
import { findOutput, updateLinksTo } from "../../../data/output/findOutput";
import logger from "../../../plugins/logger";
import NotifyEdit from "../../outputs/notify-edit";
import EmailEdit from "../../outputs/email-edit";
import FreshdeskEdit from "../../outputs/freshdesk-edit";
import S3FileUploadEdit from "../../outputs/s3fileupload-edit";
import WebhookEdit from "../../outputs/webhook-edit";
import { OutputType, Output, responses } from "../../outputs/types";

interface OutputEditProps extends WithI18nProps {
  output: Output;
  onEdit: Function;
}

interface State extends Output {
  isEditingSection: boolean;
  errors: any;
}

export class OutputEdit extends React.Component<OutputEditProps> {
  static contextType = DataContext;

  state: State;

  constructor(props) {
    super(props);
    const { output } = this.props;
    this.state = {
      name: output.name ?? "",
      title: output?.title ?? "",
      type: output?.type ?? "",
      previous: output?.previous ?? "",
      previousValues: output?.previousValues ?? [],
      next: output?.next ?? "",
      outputConfiguration: output?.outputConfiguration ?? null,
      isEditingSection: false,
      errors: {},
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { save, data } = this.context;
    const { title, name, type, outputConfiguration } = this.state;
    const { output } = this.props;

    let validationErrors = this.validate(title, name);
    if (hasValidationErrors(validationErrors)) return;

    let copy = { ...data };
    const [copyOutput, copyIndex] = findOutput(data, output.name);
    console.log(copyOutput);
    const nameChanged = name !== output.name;

    if (nameChanged) {
      copy = updateLinksTo(data, output.name, name);
      copyOutput.name = name;
    }

    copyOutput.title = title;
    copyOutput.type = type;
    copyOutput.outputConfiguration = outputConfiguration;
    console.log(copyOutput);

    copy.outputs[copyIndex] = copyOutput;
    try {
      await save(copy);
      this.props.onEdit({ data });
    } catch (err) {
      logger.error("OutputEdit", err);
    }
  };

  validate = (title, name) => {
    const { output } = this.props;
    const { data } = this.context;
    const titleErrors = validateTitle("output-title", title);
    const errors = { ...titleErrors };

    let nameHasErrors: boolean = false;

    if (name !== output.name)
      nameHasErrors = data.outputs.find((output) => output.name === name);
    if (nameHasErrors) {
      errors.name = {
        href: "#output-name",
        children: `Name '${name}' already exists`,
      };
    }

    this.setState({ errors });

    return errors;
  };

  onClickDelete = async (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { save, data } = this.context;
    const { output } = this.props;
    const copy = clone(data);

    const copyOutputIdx = copy.outputs.findIndex((o) => o.name === output.name);

    // Remove all links to the page
    copy.outputs.forEach((o, index) => {
      if (index !== copyOutputIdx && Array.isArray(o.next)) {
        for (let i = o.next.length - 1; i >= 0; i--) {
          const next = o.next[i];
          if (next === output.name) {
            o.next.splice(i, 1);
          }
        }
      }
    });

    copy.outputs.splice(copyOutputIdx, 1);
    try {
      await save(copy);
      this.props.onEdit({ data });
    } catch (error) {
      logger.error("OutputEdit", error);
    }
  };

  onClickDuplicate = async (e) => {
    e.preventDefault();
    const { output } = this.props;
    const { data, save } = this.context;
    const copy = clone(data);
    const duplicatedOutput = clone(output);
    duplicatedOutput.name = `${duplicatedOutput.name}-${randomId()}`;
    copy.outputs.push(duplicatedOutput);
    try {
      await save(copy);
    } catch (err) {
      logger.error("OutputEdit", err);
    }
  };

  onChangeTitle = (e) => {
    const title = e.target.value;
    this.setState({
      title: title,
    });
  };

  onChangeName = (e) => {
    const name = e.target.value;
    this.setState({
      name: name,
    });
  };

  onChangeOutputConfiguration = (e) => {
    const property = e.target.name;
    const value = e.target.value;
    let outputConfigurationCopy = { ...this.state.outputConfiguration };
    outputConfigurationCopy[property] = value;
    this.setState({
      outputConfiguration: outputConfigurationCopy,
    });
  };

  onChangeType = (e) => {
    const type = e.target.value;
    this.setState({
      type: type,
    });
  };

  onChangePrevious = (e) => {
    const previous = e.target.value;
    this.setState({
      previous: previous,
    });
  };

  onChangePreviousValues = (e) => {
    let previousValuesCopy = [...this.state.previousValues];
    console.log(e.target.name);
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

  getValuesForPreviousOutput = (previous) => {
    const { data } = this.context;
    const [previousOutput] = findOutput(data, previous);
    const previousOutputType = previousOutput.type;
    let responseFormat = responses[previousOutputType];
    console.log(previousOutputType);
    console.log(responseFormat);
    return (
      <div className="govuk-checkboxes govuk-form-group">
        <label className="govuk-label govuk-checkboxes__label">
          Previous output values
        </label>
        <span className="govuk-hint govuk-checkboxes__hint">
          Choose which values are needed for processing this output
        </span>
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
    );
  };

  findSectionWithName(name) {
    const { data } = this.context;
    const { sections } = data;
    return sections.find((section) => section.name === name);
  }

  render() {
    const { data } = this.context;
    const { i18n } = this.props;
    const { title, name, outputConfiguration, type, errors } = this.state;

    let outputEdit: React.ReactNode;

    if (type === OutputType.Notify) {
      outputEdit = (
        <NotifyEdit data={data} output={this.props.output} errors={errors} />
      );
    } else if (type === OutputType.Email) {
      outputEdit = <EmailEdit output={this.props.output} errors={errors} />;
    } else if (type === OutputType.Webhook) {
      outputEdit = (
        <WebhookEdit
          url={outputConfiguration?.["url"]}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
        />
      );
    } else if (type === OutputType.Freshdesk) {
      outputEdit = (
        <FreshdeskEdit
          customFields={outputConfiguration?.["customFields"]}
          freshdeskHost={outputConfiguration?.["freshdeskHost"]}
          apiKey={outputConfiguration?.["apiKey"]}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
        />
      );
    } else if (type === OutputType.S3FileUpload) {
      console.log("Inside S3FileUpload");
      outputEdit = (
        <S3FileUploadEdit
          apiKey={outputConfiguration?.["apiKey"]}
          endpoint={outputConfiguration?.["endpoint"]}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
        />
      );
    }

    return (
      <div>
        {Object.keys(errors).length > 0 && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={this.onSubmit} autoComplete="off">
          <Input
            id="output-title"
            name="output-title"
            label={{
              className: "govuk-label--s",
              children: ["Title"],
            }}
            defaultValue={title ?? ""}
            errorMessage={
              errors?.title ? { children: errors?.title.children } : undefined
            }
            onChange={this.onChangeTitle}
          />
          <Input
            id="output-name"
            name="output-name"
            label={{
              className: "govuk-label--s",
              children: ["Name"],
            }}
            pattern="^\S+"
            defaultValue={name ?? ""}
            onChange={this.onChangeName}
            errorMessage={
              errors?.name ? { children: errors?.name.children } : undefined
            }
          />
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="output-type">
              Output type
            </label>
            <select
              className="govuk-select"
              id="output-type"
              name="output-type"
              value={this.state.type}
              onChange={this.onChangeType}
            >
              <option value="email">Email</option>
              <option value="notify">Email via GOVUK Notify</option>
              <option value="webhook">Webhook</option>
              <option value="freshdesk">Freshdesk</option>
              <option value="s3fileupload">Upload File to S3</option>
            </select>
          </div>
          {outputEdit}
          {/* <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="previous">
              {i18n("Previous output")}
            </label>
            <span className="govuk-hint">
              {i18n(
                "If this output relies on previous values to run, choos ethe output to take these values from here"
              )}
            </span>
            <select
              className="govuk-select"
              id="previous"
              name="previous"
              value={previous}
              onChange={this.onChangePrevious}
            >
              <option />
              {outputs.map((output) => (
                <option key={output.name} value={output.name}>
                  {output.title}
                </option>
              ))}
            </select>
          </div> */}
          {/* {previous && this.getValuesForPreviousOutput(previous)} */}
          <button className="govuk-button" type="submit">
            {i18n("save")}
          </button>{" "}
          <button
            className="govuk-button"
            type="button"
            onClick={this.onClickDelete}
          >
            {i18n("delete")}
          </button>
        </form>
      </div>
    );
  }
}

export default withI18n(OutputEdit);
