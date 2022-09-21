import SelectConditions from "@xgovformbuilder/designer/client/components/Conditions/SelectConditions";
import { addLink } from "@xgovformbuilder/designer/client/components/Page/data";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import classNames from "classnames";
import { ErrorMessage } from "govuk-react-jsx";
import React from "react";
import Select from "react-select";

interface Props {
  onCreate: (e: any) => void;
}

interface Errors {
  [key: string]: any;
}

interface State {
  errors: Errors;
  from: string;
  to: string;
  selectedCondition?: string;
}

class LinkCreate extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: {},
      from: "",
      to: "",
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { data, save } = this.context;
    console.log(this.context);
    const { from, to, selectedCondition } = this.state;
    console.log(this.state);
    const hasValidationErrors = this.validate();
    if (hasValidationErrors) return;

    const copy = { ...data };
    const linkRes = addLink(copy, from, to, selectedCondition);
    if (linkRes instanceof Error) {
      logger.error("LinkCreate", linkRes);
    } else {
      const savedData = await save({ ...linkRes });
      this.props.onCreate({ data: savedData });
    }
  };

  conditionSelected = (selectedCondition) => {
    this.setState({
      selectedCondition: selectedCondition,
    });
  };

  storeValue = (e, key) => {
    console.log(e, key);
    const input = e;
    console.log(input);
    const stateUpdate = {};
    stateUpdate[key] = input.value;
    console.log(input.value);

    this.setState(stateUpdate);
  };

  validate = () => {
    const { from, to } = this.state;
    let errors: Errors = {};
    if (!from) {
      errors.from = { href: "#link-source", children: "Enter from" };
    }
    if (!to) {
      errors.to = { href: "#link-target", children: "Enter to" };
    }
    this.setState({
      errors,
    });
    return !from || !to;
  };

  render() {
    const { data } = this.context;
    const { pages } = data;
    const { from, errors } = this.state;
    let hasValidationErrors = Object.keys(errors).length > 0;

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "black" : "black",
        backgroundColor: state.isFocused ? "#999999" : null,
      }),
      control: (provided) => ({
        ...provided,
        border: 0,
        boxShadow: "none",
      }),
      container: (provided) => ({
        ...provided,
        height: "auto",
        width: "auto",
      }),
    };

    return (
      <>
        {hasValidationErrors && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <div className="govuk-hint">{i18n("addLink.hint1")}</div>
        <div className="govuk-hint">{i18n("addLink.hint2")}</div>
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          <div
            className={classNames({
              "govuk-form-group": true,
              "govuk-form-group--error": errors?.from,
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-source">
              From
            </label>
            {errors?.from && (
              <ErrorMessage>{errors?.from.children}</ErrorMessage>
            )}

            <Select
              className={classNames({
                "govuk-select": true,
                "govuk-input--error": errors?.from,
              })}
              id="link-source"
              data-testid="link-source"
              name="path"
              styles={customStyles}
              onChange={(e) => this.storeValue(e, "from")}
              options={pages.map((page) => ({
                label: page.title,
                value: page.path,
                dataTestid: "link-source-option",
              }))}
            />
          </div>

          {/* <select
              className={classNames({
                "govuk-select": true,
                "govuk-input--error": errors?.from,
              })}
              id="link-source"
              data-testid="link-source"
              name="path"
              onChange={(e) => this.storeValue(e, "from")}
            >
              <option />
              {pages.map((page) => (
                <option
                  key={page.path}
                  value={page.path}
                  data-testid="link-source-option"
                >
                  {page.title}
                </option>
              ))}
            </select>
          </div> */}

          <div
            className={classNames({
              "govuk-form-group": true,
              "govuk-form-group--error": errors?.to,
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-target">
              To
            </label>
            {errors?.to && <ErrorMessage>{errors?.to.children}</ErrorMessage>}

            <Select
              className={classNames({
                "govuk-select": true,
                "govuk-input--error": errors?.to,
              })}
              id="link-target"
              data-testid="link-target"
              name="page"
              styles={customStyles}
              onChange={(e) => this.storeValue(e, "to")}
              options={pages.map((page) => ({
                label: page.title,
                value: page.path,
                dataTestid: "link-target-option",
              }))}
            />

            {/* <select
              className={classNames({
                "govuk-select": true,
                "govuk-input--error": errors?.to,
              })}
              id="link-target"
              data-testid="link-target"
              name="page"
              onChange={(e) => this.storeValue(e, "to")}
            >
              <option />
              {pages.map((page) => (
                <option
                  key={page.path}
                  value={page.path}
                  data-testid="link-target-option"
                >
                  {page.title}
                </option>
              ))}
            </select> */}
          </div>

          {from && from.trim() !== "" && (
            <SelectConditions
              data={data}
              hints={[]}
              path={from}
              conditionsChange={this.conditionSelected}
              noFieldsHintText={i18n("addLink.noFieldsAvailable")}
            />
          )}

          <button className="govuk-button" type="submit">
            Save
          </button>
        </form>
      </>
    );
  }
}

export default LinkCreate;
