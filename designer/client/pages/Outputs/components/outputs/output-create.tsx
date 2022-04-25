import React from "react";
import { Input } from "@xgovformbuilder/govuk-react-jsx";
import { FormDefinition } from "@xgovformbuilder/model";
import ErrorSummary from "../../../../error-summary";
import { validateTitle, hasValidationErrors } from "../../../../validations";
import { DataContext } from "../../../../context";
import { addLink, findOutput } from "../../data";
import { addOutput } from "../../data/addOutput";
import { randomId } from "../../../../helpers";
import logger from "../../../../plugins/logger";
import { Output, OutputType, responses } from "../../outputs/types";
import { withI18n, WithI18nProps } from "../../../../i18n";
import NotifyEdit from "../../outputs/notify-edit";
import EmailEdit from "../../outputs/email-edit";
import FreshdeskEdit from "../../outputs/freshdesk-edit";
import S3FileUploadEdit from "../../outputs/s3fileupload-edit";
import WebhookEdit from "../../outputs/webhook-edit";

interface State extends Output {
  errors: any;
}

interface Props extends WithI18nProps {
  onCreate: Function;
  data: FormDefinition;
}

class OutputCreate extends React.Component<Props> {
  static contextType = DataContext;

  state: State;

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: randomId(),
      title: "",
      type: OutputType.Webhook,
      outputConfiguration: {
        url: "",
      },
      previous: "",
      previousValues: [],
      next: [],
      errors: {},
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { data, save } = this.context;

    const title = this.state.title?.trim();
    const previous = this.state.previous?.trim();
    const type = this.state.type?.trim();
    const name = this.state.name;
    const previousValues = this.state.previousValues;
    const outputConfiguration = this.state.outputConfiguration;

    let validationErrors = this.validate(title, name);
    if (hasValidationErrors(validationErrors)) return;

    const value = {
      name,
      title,
      previous,
      type,
      outputConfiguration,
      previousValues,
    };

    let copy = addOutput({ ...data }, value);

    if (previous) {
      copy = addLink(copy, previous, name);
    }

    console.log(copy);

    try {
      await save(copy);
      this.props.onCreate();
    } catch (err) {
      console.log(err);
      logger.error("OutputCreate", err);
    }
  };

  validate = (title, name) => {
    const { data, i18n } = this.props;
    const titleErrors = validateTitle("output-title", title, i18n);
    const errors = { ...titleErrors };
    const alreadyExists = data.outputs.find((output) => output.name === name);
    if (alreadyExists) {
      errors.name = {
        href: "#output-name",
        children: `Name '${name}' already exists`,
      };
    }

    this.setState({ errors });

    return errors;
  };

  onChangeLinkFrom = (e) => {
    this.setState({
      linkFrom: e.target.value,
    });
  };

  onChangeOutputType = (e) => {
    this.setState({
      type: e.target.value,
    });
  };

  onChangeTitle = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  onChangePrevious = (e) => {
    this.setState({
      previous: e.target.value,
    });
  };

  onChangeName = (e) => {
    this.setState({
      name: e.target.value,
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

  getValuesForPreviousOutput = (previous) => {
    const { data } = this.props;
    const [previousOutput] = findOutput(data, previous);
    const previousOutputType = previousOutput.type;
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
    const { data, i18n } = this.props;
    const { outputs } = data;
    const {
      type,
      title,
      name,
      outputConfiguration,
      previous,
      previousValues,
      next,
      errors,
    } = this.state;

    let currentOutput: Output = {
      title: title,
      type: type,
      name: name,
      outputConfiguration: outputConfiguration,
      previous: previous,
      previousValues: previousValues,
      next: next,
    };

    let outputEdit: React.ReactNode;

    if (type === OutputType.Notify) {
      outputEdit = (
        <NotifyEdit data={data} output={currentOutput} errors={errors} />
      );
    } else if (type === OutputType.Email) {
      outputEdit = <EmailEdit output={currentOutput} errors={errors} />;
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
        {hasValidationErrors(errors) && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          <Input
            id="page-title"
            name="title"
            label={{
              className: "govuk-label--s",
              children: [i18n("addOutput.titleField.title")],
            }}
            value={title || ""}
            onChange={this.onChangeTitle}
            errorMessage={
              errors?.title ? { children: errors?.title.children } : undefined
            }
          />
          <Input
            id="output-name"
            name="name"
            label={{
              className: "govuk-label--s",
              children: [i18n("addOutput.nameField.title")],
            }}
            hint={{
              children: [i18n("addOutput.nameField.helpText")],
            }}
            value={name}
            onChange={this.onChangeName}
            errorMessage={
              errors?.path ? { children: errors?.path?.children } : undefined
            }
          />
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="output-type">
              {i18n("addOutput.outputTypeOption.title")}
            </label>
            <span className="govuk-hint">
              {i18n("addOutput.outputTypeOption.helpText")}
            </span>
            <select
              className="govuk-select"
              id="output-type"
              name="output-type"
              value={type}
              onChange={this.onChangeOutputType}
            >
              <option value="email">Email</option>
              <option value="notify">Email via GOVUK Notify</option>
              <option value="webhook">Webhook</option>
              <option value="freshdesk">Freshdesk</option>
              <option value="s3fileupload">Upload File to S3</option>
            </select>
          </div>

          {outputEdit}

          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="previous">
              {i18n("addOutput.previous.title")}
            </label>
            <span className="govuk-hint">
              {i18n("addOutput.previous.helpText")}
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
          </div>

          {previous && this.getValuesForPreviousOutput(previous)}

          <button type="submit" className="govuk-button">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default withI18n(OutputCreate);
