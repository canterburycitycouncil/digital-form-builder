import { Input } from "@xgovformbuilder/govuk-react-jsx";
// import { Checkboxes } from "@xgovformbuilder/govuk-react-jsx";
import { ErrorMessage } from "@xgovformbuilder/govuk-react-jsx";
import { FormDefinition } from "@xgovformbuilder/model";
import classNames from "classnames";
import React, { ChangeEvent, Component } from "react";

import { allInputs } from "../../../components/FormComponent/componentData/inputs";
// import { i18n } from "../../../i18n";
import NotifyEditItems from "./notify-edit-items";
import {
  NotifyOutputConfiguration,
  Output,
  OutputType,
  ValidationErrors,
} from "./types";

type State = {
  previousOutputKeys: NotifyItemValue[];
};

type Props = {
  data: FormDefinition; // TODO: type
  output: Output;
  errors: ValidationErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onItemDelete: (propertyName: string) => void;
  onItemAdd: (propertyName: string, value: any) => void;
};

interface NotifyItemValue {
  name: string;
  display: string;
}

class NotifyEdit extends Component<Props, State> {
  usableKeys: NotifyItemValue[];
  systemKeys: NotifyItemValue[];

  constructor(props: Props) {
    super(props);
    const { data } = this.props;

    this.usableKeys = allInputs(data).map((input) => ({
      name: input.propertyPath || "",
      display: input.title || "",
    }));
    this.systemKeys = [
      {
        name: "formId",
        display: "Form ID",
      },
      {
        name: "submissionId",
        display: "Submission ID",
      },
    ];
    this.state = {
      previousOutputKeys: this.props.output.previous
        ? this.getResponseValuesFromOutput(this.props.output.previous)
        : [],
    };
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    if (
      (!prevProps.output.previous && this.props.output.previous) ||
      (prevProps.output.previous &&
        this.props.output.previous &&
        prevProps.output.previous !== this.props.output.previous)
    ) {
      this.setState({
        previousOutputKeys: this.getResponseValuesFromOutput(
          this.props.output.previous
        ),
      });
    } else if (prevProps.output.previous && !this.props.output.previous) {
      this.setState({
        previousOutputKeys: [],
      });
    }
  }

  getResponseValuesFromOutput(outputName) {
    const { data } = this.props;
    let output = data.outputs.find((output) => output.name === outputName);
    if (output) {
      let values: NotifyItemValue[] = [];
      switch (output.type) {
        case OutputType.Webhook:
          values = values.concat([]);
          break;
        case OutputType.Freshdesk:
          values = values.concat([
            {
              name: `output.${outputName}.ticketId`,
              display: "Freshdesk ticket id",
            },
          ]);
          break;
        case OutputType.Notify:
          values = values.concat([]);
          break;
        case OutputType.S3FileUpload:
          values = values.concat([
            {
              name: `output.${outputName}.newSubmission`,
              display: "Submission response from S3 file upload",
            },
            {
              name: `output.${outputName}.uploadedFiles`,
              display: "File urls uploaded via S3",
            },
          ]);
          break;
        case OutputType.Topdesk:
          values = values.concat([
            {
              name: `output.${outputName}.id`,
              display: `TopDesk ticket ID`,
            },
            {
              name: `output.${outputName}.number`,
              display: "TopDesk ticket number",
            },
            {
              name: `output.${outputName}.viewLink`,
              display: "TopDesk ticket view link",
            },
          ]);
          break;
        case OutputType.TopdeskIncident:
          values = values.concat([
            {
              name: `output.${outputName}.id`,
              display: `TopDesk ticket ID`,
            },
            {
              name: `output.${outputName}.number`,
              display: "TopDesk ticket number",
            },
            {
              name: `output.${outputName}.viewLink`,
              display: "TopDesk ticket view link",
            },
          ]);
          break;
        case OutputType.Email:
          values = values.concat([]);
          break;
        default:
          values = values.concat([]);
          break;
      }
      if (output.previous) {
        return values.concat(this.getResponseValuesFromOutput(output.previous));
      } else {
        return values;
      }
    } else {
      return [];
    }
  }

  render() {
    const {
      data,
      output,
      errors,
      onChange,
      onItemDelete,
      onItemAdd,
    } = this.props;
    const { conditions } = data;
    const outputConfiguration = (typeof output.outputConfiguration === "object"
      ? output.outputConfiguration
      : {
          templateId: "",
          apiKey: "",
          emailField: "",
          personalisation: [],
        }) as NotifyOutputConfiguration;

    const { templateId, apiKey, emailField } = outputConfiguration;
    const personalisation = outputConfiguration.personalisation;
    console.log(this.state.previousOutputKeys);
    const values = [
      ...conditions.map((condition) => ({
        name: condition.name,
        display: condition.displayName,
      })),
      ...this.usableKeys,
      ...this.systemKeys,
      ...this.state.previousOutputKeys,
    ];

    return (
      <div className="govuk-body">
        <Input
          id="templateId"
          name="templateId"
          label={{
            className: "govuk-label--s",
            children: ["Template ID"],
          }}
          defaultValue={templateId}
          step="any"
          errorMessage={
            errors?.templateId
              ? { children: errors?.templateId.children }
              : undefined
          }
          onChange={onChange}
        />
        <Input
          id="apiKey"
          name="apiKey"
          label={{
            className: "govuk-label--s",
            children: ["API Key"],
          }}
          defaultValue={apiKey}
          step="any"
          errorMessage={
            errors?.apiKey ? { children: errors?.apiKey.children } : undefined
          }
          onChange={onChange}
        />
        <div
          className={classNames({
            "govuk-form-group": true,
            "govuk-form-group--error": errors?.email,
          })}
        >
          <label className="govuk-label" htmlFor="email-field">
            Email field
          </label>
          {errors?.email && (
            <ErrorMessage>{errors?.email.children}</ErrorMessage>
          )}
          <select
            className={classNames({
              "govuk-select": true,
              "govuk-input--error": errors?.email,
            })}
            id="emailField"
            name="emailField"
            defaultValue={emailField}
            onChange={onChange}
          >
            {this.usableKeys.map((value, i) => (
              <option key={`${value.name}-${i}`} value={value.name}>
                {value.display ?? value.name}
              </option>
            ))}
          </select>
        </div>
        <NotifyEditItems
          items={personalisation}
          values={values}
          data={data}
          onChange={onChange}
          onItemDelete={onItemDelete}
          onItemAdd={onItemAdd}
        />
        {/* <div className="govuk-form-group">
          <Checkboxes
            items={[
              {
                children: (
                  <strong>
                    {i18n("outputEdit.notifyEdit.includeReferenceTitle")}
                  </strong>
                ),
                hint: {
                  children: i18n("outputEdit.notifyEdit.includeReferenceHint"),
                },
                value: true,
              },
            ]}
            name="add-references-to-personalisation"
          />
        </div> */}
      </div>
    );
  }
}

export default NotifyEdit;
