import React from "react";
import { clone, Fee, Condition, FormDefinition } from "@xgovformbuilder/model";
import { ErrorMessage } from "govuk-react-jsx";
import classNames from "classnames";

import { isEmpty } from "../../helpers";
import { DataContext } from "../../context";
import logger from "../../plugins/logger";

function headDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === arr[i]) {
        return j;
      }
    }
  }
  return null;
}

interface Props {
  items: Fee[];
  conditions: Condition[];
  ref: React.RefObject<FeeItems>;
  data: FormDefinition;
  fee: Fee;
  onEdit: ({ data }) => void;
}

interface State {
  items: Fee[];
  errors: MissingError;
}

interface MissingError {
  href?: string;
  children?: string;
  [key: string]: boolean | string | undefined | MissingError;
}

const MISSING_DESC = "missingDescription";
const INVALID_AMOUNT = "invalidAmount";
const MISSING_COND = "missingCondition";
const DUP_CONDITIONS = "dupConditions";

class FeeItems extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      items: props.items ? clone(props.items) : [],
      errors: {},
    };
  }

  validate = (form) => {
    let errors = {};
    const formData = new window.FormData(form);
    let missingDescription = false;
    let missingDescriptions: MissingError = {};
    let amountInvalid = false;
    let amountsInvalid: MissingError = {};
    let missingCondition = false;
    let missingConditions: MissingError = {};
    formData.getAll("description").forEach((d, i) => {
      if (isEmpty(d as string)) {
        missingDescriptions[i] = true;
        missingDescription = true;
      }
    });
    if (missingDescription) {
      missingDescriptions.href = "#items-table";
      missingDescriptions.children = "Enter description";
      errors[MISSING_DESC] = missingDescriptions;
    }

    formData.getAll("condition").forEach((d, i) => {
      if (isEmpty(d as string)) {
        missingDescriptions[i] = true;
        missingCondition = true;
      }
    });
    if (missingCondition) {
      missingConditions.href = "#items-table";
      missingConditions.children = "Select a condition";
      errors[MISSING_COND] = missingConditions;
    }

    formData.getAll("amount").forEach((d, i) => {
      if (((d as unknown) as number) < 0) {
        amountsInvalid[i] = true;
        amountInvalid = true;
      }
    });
    if (amountInvalid) {
      amountsInvalid.href = "#items-table";
      amountsInvalid.children = "Enter a valid amount";
      errors[INVALID_AMOUNT] = amountsInvalid;
    }

    const descriptions = formData
      .getAll("description")
      .map((t) => (t as string).trim());
    const conditions = formData
      .getAll("condition")
      .map((t) => (t as string).trim());

    // Only validate dupes if there is more than one item
    if (descriptions.length >= 2 && headDuplicate(conditions)) {
      errors[DUP_CONDITIONS] = {
        href: "#items-table",
        children: "Duplicate conditions found in the list items",
      };
    }

    this.setState({
      errors,
    });

    return errors;
  };

  onClickAddItem = (e) => {
    e.preventDefault();
    this.setState({
      items: this.state.items.concat({
        description: "",
        amount: 0,
        condition: "",
      }),
    });
  };

  removeItem = (idx) => {
    this.setState(() => ({
      items: this.state.items.filter((s, i) => i !== idx),
      errors: {},
    }));
  };

  onClickDelete = (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { data, fee } = this.props;
    const { save } = this.context;
    const copy = clone(data);

    // Remove the list
    (copy.fees as Fee[]).splice(data.fees.indexOf(fee), 1);

    save(copy)
      .then((data) => {
        this.props.onEdit({ data });
      })
      .catch((err) => {
        logger.error("FeeItems", err);
      });
  };

  render() {
    const { items, errors } = this.state;
    const { conditions } = this.props;

    let hasValidationErrors = Object.keys(errors).length > 0;

    const errorMessages = Object.entries(errors).map(([key, value]) => {
      return (
        <ErrorMessage key={key}>
          {value ? (value as MissingError).children : null}
        </ErrorMessage>
      );
    });

    return (
      <div
        className={classNames({
          "govuk-form-group": true,
          "govuk-form-group--error": hasValidationErrors,
        })}
      >
        {errorMessages}

        <table className="govuk-table" id="items-table">
          <caption className="govuk-table__caption">Items</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header" scope="col">
                Description
              </th>
              <th className="govuk-table__header" scope="col">
                Cost
              </th>
              <th className="govuk-table__header" scope="col">
                Condition
              </th>
              <th className="govuk-table__header" scope="col">
                <a
                  className="pull-right"
                  href="#"
                  onClick={this.onClickAddItem}
                >
                  Add
                </a>
              </th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {items.map((item, index) => (
              <tr key={item.description + index} className="govuk-table__row">
                <td className="govuk-table__cell">
                  <input
                    className={classNames({
                      "govuk-input": true,
                      "govuk-input--error": errors?.[MISSING_DESC]?.[index],
                    })}
                    name="description"
                    type="text"
                    defaultValue={item.description}
                  />
                </td>
                <td className="govuk-table__cell">
                  <input
                    className={classNames({
                      "govuk-input": true,
                      "govuk-input--error": errors?.[INVALID_AMOUNT]?.[index],
                    })}
                    name="amount"
                    type="number"
                    defaultValue={item.amount}
                    step="any"
                  />
                </td>
                <td className="govuk-table__cell">
                  <select
                    className={classNames({
                      "govuk-select": true,
                      "govuk-input--error": errors?.[MISSING_COND]?.[index],
                    })}
                    id="link-source"
                    name="condition"
                    defaultValue={item.condition}
                  >
                    {conditions.map((condition, i) => (
                      <option key={condition.name + i} value={condition.name}>
                        {condition.displayName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="govuk-table__cell" width="20px">
                  <a
                    className="list-item-delete"
                    onClick={() => this.removeItem(index)}
                  >
                    &#128465;
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FeeItems;