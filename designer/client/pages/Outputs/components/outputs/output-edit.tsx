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
import { clone } from "@xgovformbuilder/model";
import React from "react";

import { findOutput, updateLinksTo } from "../../data/findOutput";
import EmailEdit from "../../outputs/email-edit";
import FreshdeskEdit from "../../outputs/freshdesk-edit";
import NotifyEdit from "../../outputs/notify-edit";
import S3FileUploadEdit from "../../outputs/s3fileupload-edit";
import TopdeskEdit from "../../outputs/topdesk-edit";
import { Output, OutputType } from "../../outputs/types";
import WebhookEdit from "../../outputs/webhook-edit";

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
      condition: output?.condition ?? "",
      type: output?.type ?? "",
      previous: output?.previous ?? "",
      next: output?.next ?? "",
      outputConfiguration: output?.outputConfiguration ?? null,
      isEditingSection: false,
      errors: {},
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { save, data } = this.context;
    const { title, name, type, outputConfiguration, condition } = this.state;
    const { output } = this.props;

    let validationErrors = this.validate(title, name);
    if (hasValidationErrors(validationErrors)) return;

    let copy = { ...data };
    let [copyOutput, copyIndex] = findOutput(data, output.name);
    const nameChanged = name !== output.name;

    if (nameChanged) {
      copy = updateLinksTo(data, output.name, name);
      copyOutput.name = name;
    }

    copyOutput.title = title;
    copyOutput.type = type;
    copyOutput.outputConfiguration = outputConfiguration;
    copyOutput.condition = condition;

    copy.outputs[copyIndex] = copyOutput;
    console.log(copy.outputs[copyIndex]);
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

  findSectionWithName(name) {
    const { data } = this.context;
    const { sections } = data;
    return sections.find((section) => section.name === name);
  }

  render() {
    const { data } = this.context;
    const { i18n } = this.props;
    const {
      title,
      name,
      outputConfiguration,
      type,
      errors,
      condition,
    } = this.state;

    let outputEdit: React.ReactNode;

    if (type === OutputType.Notify) {
      outputEdit = (
        <NotifyEdit
          data={data}
          output={this.props.output}
          errors={errors}
          onChange={this.onChangeOutputConfiguration}
          onItemDelete={this.onDeleteNestedOutputConfigurationValue}
          onItemAdd={this.onAddNestedConfigurationOutputValue}
        />
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
          briefDescription={outputConfiguration?.["briefDescription"]}
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
              <option value="topdesk">Create topdesk ticket</option>
            </select>
          </div>
          {outputEdit}
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
