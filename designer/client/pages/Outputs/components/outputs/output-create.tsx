import SelectConditions from "@xgovformbuilder/designer/client/components/Conditions/SelectConditions";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { randomId } from "@xgovformbuilder/designer/client/helpers";
import { withI18n, WithI18nProps } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import {
  hasValidationErrors,
  validateTitle,
} from "@xgovformbuilder/designer/client/validations";
import { Input } from "@xgovformbuilder/govuk-react-jsx";
import { FormDefinition, Output, OutputType } from "@xgovformbuilder/model";
import React from "react";

import { addLink } from "../../data";
import { addOutput } from "../../data/addOutput";
import EmailEdit from "../../outputs/email-edit";
import FreshdeskEdit from "../../outputs/freshdesk-edit";
import NotifyEdit from "../../outputs/notify-edit";
import S3FileUploadEdit from "../../outputs/s3fileupload-edit";
import TopdeskEdit from "../../outputs/topdesk-edit";
import TopdeskIncidentEdit from "../../outputs/topdesk-incident-edit";
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
      condition: "",
      title: "",
      type: OutputType.Webhook,
      outputConfiguration: {
        url: "",
      },
      previous: "",
      next: [],
      errors: {},
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { data, save } = this.context;

    const title = this.state.title?.trim();
    const previous = this.state.previous?.trim();
    const type = this.state.type;
    const name = this.state.name;
    const condition = this.state.condition;
    const outputConfiguration = this.state.outputConfiguration;
    const next = this.state.next;

    let validationErrors = this.validate(title, name);
    if (hasValidationErrors(validationErrors)) return;

    const value: Output = {
      name,
      condition,
      title,
      previous,
      type,
      outputConfiguration,
      next,
    };

    let copy = addOutput({ ...data }, value);

    if (previous) {
      copy = addLink(copy, previous, name);
    }

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
      outputConfiguration: {},
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

  onConditionSelected = (condition) => {
    this.setState({
      condition: condition,
    });
  };

  onChangeOutputConfiguration = (e) => {
    const property = e.target.name;
    const value = e.target.value;
    let outputConfigurationCopy = { ...this.state.outputConfiguration };
    if (property.indexOf(".") > -1) {
      let splitProperty: string[] = property.split(".");
      let lastKey = splitProperty.pop();
      if (lastKey) {
        let nestedValue = splitProperty.reduce(
          (acc, currentKey) => acc[currentKey],
          outputConfigurationCopy
        );
        nestedValue[lastKey] = value;
      }
    } else {
      outputConfigurationCopy[property] = value;
    }
    this.setState({
      outputConfiguration: outputConfigurationCopy,
    });
  };

  onDeleteNestedOutputConfigurationValue = (propertyName: string) => {
    let outputConfigurationCopy = { ...this.state.outputConfiguration };
    if (propertyName.indexOf(".") > -1) {
      let splitProperty: string[] = propertyName.split(".");
      let lastKey = splitProperty.pop();
      if (lastKey) {
        let nestedValue = splitProperty.reduce(
          (acc, currentKey) => acc[currentKey],
          outputConfigurationCopy
        );
        if (Array.isArray(nestedValue)) {
          nestedValue.splice(parseInt(lastKey), 1);
        } else {
          delete nestedValue[lastKey];
        }
      }
    } else if (outputConfigurationCopy[propertyName]) {
      delete outputConfigurationCopy[propertyName];
    }
    this.setState({
      outputConfiguration: outputConfigurationCopy,
    });
  };

  onAddNestedConfigurationOutputValue = (propertyName: string, value: any) => {
    let outputConfigurationCopy = { ...this.state.outputConfiguration };
    if (propertyName.indexOf(".") > -1) {
      let splitProperty: string[] = propertyName.split(".");
      let lastKey = splitProperty.pop();
      if (lastKey) {
        let nestedValue = splitProperty.reduce(
          (acc, currentKey) => acc[currentKey],
          outputConfigurationCopy
        );
        nestedValue[lastKey] = value;
      }
    } else {
      outputConfigurationCopy[propertyName] = value;
    }
    this.setState({
      outputConfiguration: outputConfigurationCopy,
    });
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
      next,
      errors,
      condition,
    } = this.state;

    let currentOutput: Output = {
      title: title,
      type: type,
      name: name,
      outputConfiguration: outputConfiguration,
      previous: previous,
      next: next,
    };

    let outputEdit: React.ReactNode;

    if (type === OutputType.Notify) {
      outputEdit = (
        <NotifyEdit
          data={data}
          output={currentOutput}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
          onItemDelete={this.onDeleteNestedOutputConfigurationValue}
          onItemAdd={this.onAddNestedConfigurationOutputValue}
        />
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
      outputEdit = (
        <S3FileUploadEdit
          apiKey={outputConfiguration?.["apiKey"]}
          endpoint={outputConfiguration?.["endpoint"]}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
        />
      );
    } else if (type === OutputType.Topdesk) {
      outputEdit = (
        <TopdeskEdit
          template={outputConfiguration?.["template"]}
          email={outputConfiguration?.["email"]}
          briefDescription={outputConfiguration?.["briefDecsription"]}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
        />
      );
    } else if (type === OutputType.TopdeskIncident) {
      outputEdit = (
        <TopdeskIncidentEdit
          email={outputConfiguration?.["email"]}
          briefDescription={outputConfiguration?.["briefDecsription"]}
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
          <SelectConditions
            data={data}
            hints={[]}
            path={""}
            selectedCondition={condition}
            conditionsChange={this.onConditionSelected}
            noFieldsHintText={i18n("conditions.noFieldsAvailable")}
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
              <option value="topdesk">Create topdesk ticket</option>
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

          <button type="submit" className="govuk-button">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default withI18n(OutputCreate);
