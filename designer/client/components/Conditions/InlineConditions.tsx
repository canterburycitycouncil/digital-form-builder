import {
  addCondition,
  updateCondition,
} from "@xgovformbuilder/designer/client/components/Conditions/data";
import { ErrorMessage } from "@xgovformbuilder/designer/client/components/ErrorMessage";
import {
  allInputs,
  inputsAccessibleAt,
} from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { findList } from "@xgovformbuilder/designer/client/components/List/data";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import ErrorSummary, {
  ErrorListItem,
} from "@xgovformbuilder/designer/client/error-summary";
import { randomId } from "@xgovformbuilder/designer/client/helpers";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import {
  clone,
  ConditionRawData,
  ConditionsModel,
  ConditionWrapperValue,
  Item,
} from "@xgovformbuilder/model";
import classNames from "classnames";
import React, { ChangeEvent, MouseEvent } from "react";

import InlineConditionsEdit from "./inline-conditions-edit";
import InlineConditionsDefinition from "./InlineConditionsDefinition";

interface Props {
  path: string;
  condition?: ConditionRawData;
  cancelCallback?: (event: MouseEvent) => void;
  conditionsChange?: (event: MouseEvent) => void;
}

export interface FieldInput {
  label: string;
  name: string;
  type: string;
  values: string[];
}

export interface FieldInputObject {
  [key: string]: FieldInput;
}

interface State {
  editView?: boolean;
  conditions: ConditionsModel;
  fields: any;
  conditionString: any;
  validationErrors: ErrorListItem[];
}

export const yesNoValues: Readonly<Item[]> = [
  {
    text: "Yes",
    value: true,
  },
  {
    text: "No",
    value: false,
  },
];

export class InlineConditions extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    const { path, condition } = this.props;

    if (condition) {
      const conditions =
        condition && typeof condition.value === "object"
          ? ConditionsModel.from(condition.value)
          : new ConditionsModel();

      conditions.name &&= condition.displayName;

      this.state = {
        validationErrors: [],
        conditions: conditions,
        fields: this.fieldsForPath(path),
        conditionString: condition?.value,
      };
    } else {
      this.state = {
        validationErrors: [],
        conditions: new ConditionsModel(),
        fields: this.fieldsForPath(path),
        conditionString: "",
      };
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.path !== prevProps.path) {
      const fields = this.fieldsForPath(this.props.path);

      this.setState({
        conditions: new ConditionsModel(),
        fields: fields,
        editView: false,
      });
    }
  };

  fieldsForPath = (path) => {
    const { data } = this.context;

    const inputs = !!path ? inputsAccessibleAt(data, path) : allInputs(data);

    const fieldInputs: FieldInput[] = inputs.map((input) => {
      const label = [
        data.sections?.[input.page.section]?.title,
        input.title ?? input.name,
      ]
        .filter((p) => p)
        .join(" ");

      let list;
      if (input.list) {
        list = findList(data, input.list)[0];
      }

      const values =
        `${input.type}` == "YesNoField" ? yesNoValues : list?.items;

      return {
        label,
        name: input.propertyPath,
        type: input.type,
        values,
      };
    });
    const conditionsInputs: FieldInput[] = data.conditions.map((condition) => ({
      label: condition.displayName,
      name: condition.name,
      type: "Condition",
    }));

    return fieldInputs
      .concat(conditionsInputs)
      .reduce<FieldInputObject>((obj, item) => {
        obj[item.name] = item;
        return obj;
      }, {});
  };

  toggleEdit = () => {
    this.setState({
      editView: !this.state.editView,
    });
  };

  onClickCancel = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { cancelCallback } = this.props;
    this.setState({
      conditions: this.state.conditions.clear(),
      editView: false,
    });
    if (cancelCallback) {
      cancelCallback(e);
    }
  };

  onClickSave = async (event: MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();
    const { conditionsChange, condition } = this.props;
    const { data, save } = this.context;
    const { conditions } = this.state;

    const nameError = this.validateName();

    if (nameError) {
      return;
    }

    if (condition) {
      let conditionJson = conditions.toJSON();
      let updatedCondition = {
        displayName: conditionJson.name,
        value: { ...conditionJson },
      };
      const updatedData = updateCondition(
        data,
        condition.name,
        updatedCondition
      );
      await save(updatedData);
      if (conditionsChange) {
        conditionsChange(event);
      }
    } else if (conditions.hasConditions) {
      const updatedData = addCondition(data, {
        displayName: conditions.name!,
        name: randomId(),
        value: conditions.toJSON() as ConditionWrapperValue,
      });

      await save(updatedData);
      if (conditionsChange) {
        conditionsChange(event);
      }
    }
  };

  saveCondition = (condition) => {
    this.setState({
      conditions: this.state.conditions.add(condition),
    });
  };

  editCallback = (conditions: ConditionsModel) => {
    this.setState({
      conditions: conditions,
    });
  };

  onChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
    const copy = clone(this.state.conditions);
    copy.name = e.target.value;
    this.setState({
      conditions: copy,
    });
  };

  validateName = () => {
    const nameError: ErrorListItem = {
      href: "#cond-name",
      children: i18n("conditions.enterName"),
    };
    const { validationErrors } = this.state;
    const otherErrors = validationErrors.filter(
      (error) => error.href !== nameError.href
    );

    if (!this.state.conditions.name) {
      this.setState({
        validationErrors: [...otherErrors, nameError],
      });

      return true;
    }

    this.setState({ validationErrors: otherErrors });
    return false;
  };

  render() {
    const {
      conditions,
      editView,
      conditionString,
      validationErrors,
    } = this.state;
    const hasConditions = conditions.hasConditions;

    const nameError = validationErrors.filter(
      (error) => error.href === "#cond-name"
    )[0];
    const hasErrors = !!validationErrors.length;

    return (
      <div id="inline-conditions" data-testid={"inline-conditions"}>
        <div id="inline-condition-header">
          <div className="govuk-hint">{i18n("conditions.addOrEditHint")}</div>
          {typeof conditionString === "string" && (
            <div
              id="condition-string-edit-warning"
              className="govuk-warning-text"
            >
              <span className="govuk-warning-text__icon" aria-hidden="true">
                !
              </span>
              <strong className="govuk-warning-text__text">
                <span className="govuk-warning-text__assistive">
                  {i18n("warning")}
                </span>
                {i18n("conditions.youCannotEditWarning", {
                  conditionString,
                })}
              </strong>
            </div>
          )}
          <div>
            {hasErrors && <ErrorSummary errorList={validationErrors} />}
            <div
              className={classNames("govuk-form-group", {
                "govuk-form-group--error": nameError,
              })}
            >
              <label className="govuk-label govuk-label--s" htmlFor="cond-name">
                {i18n("conditions.displayName")}
              </label>
              <div className="govuk-hint">
                {i18n("conditions.displayNameHint")}
              </div>
              {nameError && <ErrorMessage>{nameError?.children}</ErrorMessage>}
              <input
                className={classNames("govuk-input govuk-input--width-20", {
                  "govuk-input--error": nameError,
                })}
                id="cond-name"
                name="cond-name"
                type="text"
                value={conditions.name ?? ""}
                required
                onChange={this.onChangeDisplayName}
              />
            </div>
            <div>
              <label
                className="govuk-label govuk-label--s"
                id="condition-string-label"
                htmlFor="condition-string"
              >
                {i18n("conditions.when")}
              </label>
            </div>
            <div className="govuk-hint">{i18n("conditions.whenHint")}</div>
          </div>
          {hasConditions && (
            <div id="conditions-display" className="govuk-body">
              {/* <div
                key="condition-string"
                id="condition-string"
                className="govuk-error-summary__title"
              >
                {conditions.toPresentationString()}
              </div> */}

              <div
                className="govuk-notification-banner govuk-notification-banner--success"
                role="alert"
              >
                <div className="govuk-notification-banner__header">
                  <h2
                    className="govuk-notification-banner__title"
                    id="govuk-notification-banner-title"
                  >
                    {i18n("conditions.savedCriteria")}
                  </h2>
                </div>
                <div className="govuk-notification-banner__content">
                  <p
                    key="condition-string"
                    id="condition-string"
                    className="govuk-notification-banner__heading"
                  >
                    {conditions.toPresentationString()}.
                    {!editView && (
                      <a
                        className="govuk-notification-banner__link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          this.toggleEdit();
                        }}
                      >
                        {i18n("conditions.notWhatYouMean")}
                      </a>
                    )}
                  </p>
                </div>
              </div>

              {/* {!editView && (
                <div>
                  <a
                    href="#"
                    id="edit-conditions-link"
                    className="govuk-link"
                    onClick={(e) => {
                      e.preventDefault();
                      this.toggleEdit();
                    }}
                  >
                    {i18n("conditions.notWhatYouMean")}
                  </a>
                </div>
              )} */}
            </div>
          )}
        </div>
        {!editView && (
          <div>
            <InlineConditionsDefinition
              expectsCoordinator={hasConditions}
              fields={this.state.fields}
              saveCallback={this.saveCondition}
            />
            <div className="govuk-form-group">
              {hasConditions && (
                <a
                  href="#"
                  id="save-inline-conditions"
                  className="govuk-button"
                  onClick={this.onClickSave}
                >
                  {i18n("save")}
                </a>
              )}
              <a
                href="#"
                id="cancel-inline-conditions-link"
                className="govuk-link"
                onClick={this.onClickCancel}
              >
                {i18n("cancel")}
              </a>
            </div>
          </div>
        )}
        {editView && (
          <InlineConditionsEdit
            conditions={conditions}
            fields={this.state.fields}
            saveCallback={this.editCallback}
            cancelCallback={this.toggleEdit}
          />
        )}
      </div>
    );
  }
}
InlineConditions.contextType = DataContext;
export default InlineConditions;
