import React, { useContext } from "react";
import { ComponentContext } from "./reducers/component/componentReducer";
import { ComponentTypes } from "@xgovformbuilder/model";
import { Actions } from "./reducers/component/types";
import { Textarea } from "@govuk-jsx/textarea";
import { Input } from "@govuk-jsx/input";
import { Select } from "@govuk-jsx/select";
import { i18n } from "./i18n";
import { ErrorMessage } from "./components/ErrorMessage";
import { DataContext } from "./context";

type Props = {
  isContentField?: boolean;
};

export function FieldEdit({ isContentField = false }: Props) {
  const { state, dispatch } = useContext(ComponentContext);
  const { data } = useContext(DataContext);
  const { selectedComponent, errors } = state;

  const { name, title, hint, attrs, type, options = {} } = selectedComponent;
  const {
    hideTitle = false,
    optionalText = false,
    required = true,
    parameterName = "",
    isInternal = false,
    isExternal = false,
    variable = "",
  } = options;
  const isFileUploadField = selectedComponent.type === "FileUploadField";
  const fieldTitle =
    ComponentTypes.find((componentType) => componentType.name === type)
      ?.title ?? "";
  let emptyVariableOption = [
    {
      children: "-Please select-",
      value: "",
    },
  ];
  const availableVariables = emptyVariableOption.concat(
    data.logicExpressions.map((expression) => {
      return {
        children: expression.variableName,
        value: expression.variableName,
      };
    })
  );

  return (
    <div>
      <div data-test-id="standard-inputs">
        <Input
          id="field-title"
          name="title"
          label={{
            className: "govuk-label--s",
            children: [i18n("common.titleField.title")],
          }}
          hint={{
            children: [i18n("common.titleField.helpText")],
          }}
          value={title || ""}
          onChange={(e) => {
            dispatch({
              type: Actions.EDIT_TITLE,
              payload: e.target.value,
            });
          }}
          errorMessage={
            errors?.title
              ? { children: i18n(errors.title[0], errors.title[1]) }
              : undefined
          }
        />
        <Textarea
          id="field-hint"
          name="hint"
          rows={2}
          label={{
            className: "govuk-label--s",
            children: [i18n("common.helpTextField.title")],
          }}
          hint={{
            children: [i18n("common.helpTextField.helpText")],
          }}
          required={false}
          value={hint}
          onChange={(e) => {
            dispatch({
              type: Actions.EDIT_HELP,
              payload: e.target.value,
            });
          }}
          {...attrs}
        />
        <div className="govuk-checkboxes govuk-form-group">
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-hideTitle"
              name="options.hideTitle"
              type="checkbox"
              checked={hideTitle}
              onChange={(e) =>
                dispatch({
                  type: Actions.EDIT_OPTIONS_HIDE_TITLE,
                  payload: e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-hideTitle"
            >
              {i18n("common.hideTitleOption.title")}
            </label>
            <span className="govuk-hint govuk-checkboxes__hint">
              {i18n("common.hideTitleOption.helpText")}
            </span>
          </div>
        </div>
        <div
          className={`govuk-form-group ${
            errors?.name ? "govuk-form-group--error" : ""
          }`}
        >
          <label className="govuk-label govuk-label--s" htmlFor="field-name">
            {i18n("common.componentNameField.title")}
          </label>
          {errors?.name && (
            <ErrorMessage>{i18n("name.errors.whitespace")}</ErrorMessage>
          )}
          <span className="govuk-hint">{i18n("name.hint")}</span>
          <input
            className={`govuk-input govuk-input--width-20 ${
              errors?.name ? "govuk-input--error" : ""
            }`}
            id="field-name"
            name="name"
            type="text"
            value={name || ""}
            onChange={(e) => {
              dispatch({
                type: Actions.EDIT_NAME,
                payload: e.target.value,
              });
            }}
          />
        </div>
        {!isContentField && (
          <div className="govuk-checkboxes govuk-form-group">
            <div className="govuk-checkboxes__item">
              <input
                type="checkbox"
                id="field-options-required"
                className={`govuk-checkboxes__input ${
                  isFileUploadField ? "disabled" : ""
                }`}
                name="options.required"
                checked={!required}
                onChange={(e) =>
                  dispatch({
                    type: Actions.EDIT_OPTIONS_REQUIRED,
                    payload: !e.target.checked,
                  })
                }
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="field-options-required"
              >
                {i18n("common.componentOptionalOption.title", {
                  component:
                    ComponentTypes.find(
                      (componentType) => componentType.name === type
                    )?.title ?? "",
                })}
              </label>
              <span className="govuk-hint govuk-checkboxes__hint">
                {i18n("common.componentOptionalOption.helpText")}
              </span>
            </div>
          </div>
        )}
        <div
          className="govuk-checkboxes govuk-form-group"
          data-test-id="field-options.optionalText-wrapper"
          hidden={required}
        >
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-optionalText"
              name="options.optionalText"
              type="checkbox"
              checked={optionalText}
              onChange={(e) =>
                dispatch({
                  type: Actions.EDIT_OPTIONS_HIDE_OPTIONAL,
                  payload: e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-optionalText"
            >
              {i18n("common.hideOptionalTextOption.title")}
            </label>
            <span className="govuk-hint govuk-checkboxes__hint">
              {i18n("common.hideOptionalTextOption.helpText")}
            </span>
          </div>
        </div>
        {!isContentField && (
          <Input
            id="field-options-parameterName"
            name="options.parameterName"
            label={{
              className: "govuk-label--s",
              children: [i18n("common.parameterNameOption.title")],
            }}
            hint={{
              children: [i18n("common.parameterNameOption.helpText")],
            }}
            value={parameterName || ""}
            onChange={(e) => {
              dispatch({
                type: Actions.EDIT_OPTIONS_PARAMETER_NAME,
                payload: e.target.value,
              });
            }}
            errorMessage={
              errors?.title
                ? { children: i18n(errors.title[0], errors.title[1]) }
                : undefined
            }
          />
        )}
        {!isContentField && (
          <Select
            id="field-options-variable"
            name="options.variable"
            label={{
              className: "govuk-label--s",
              children: [i18n("common.variableOption.title")],
            }}
            hint={{
              children: [i18n("common.variableOption.helpText")],
            }}
            items={availableVariables}
            value={variable || ""}
            onChange={(e) => {
              dispatch({
                type: Actions.EDIT_OPTIONS_VARIABLE,
                payload: e.target.value,
              });
            }}
            errorMessage={
              errors?.title
                ? { children: i18n(errors.title[0], errors.title[1]) }
                : undefined
            }
          />
        )}
        {!isContentField && (
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-isInternal"
              name="options.isInternal"
              type="checkbox"
              checked={isInternal}
              onChange={(e) =>
                dispatch({
                  type: Actions.EDIT_OPTIONS_IS_INTERNAL,
                  payload: e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-isInternal"
            >
              {i18n("common.isInternalOption.title")}
            </label>
            <span className="govuk-hint govuk-checkboxes__hint">
              {i18n("common.isInternalOption.helpText")}
            </span>
          </div>
        )}
        {!isContentField && (
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="field-options-isExternal"
              name="options.isExternal"
              type="checkbox"
              checked={isExternal}
              onChange={(e) =>
                dispatch({
                  type: Actions.EDIT_OPTIONS_IS_EXTERNAL,
                  payload: e.target.checked,
                })
              }
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="field-options-isExternal"
            >
              {i18n("common.isExternalOption.title")}
            </label>
            <span className="govuk-hint govuk-checkboxes__hint">
              {i18n("common.isExternalOption.helpText")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default FieldEdit;
