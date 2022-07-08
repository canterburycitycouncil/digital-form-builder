import {
  clone,
  ConditionRawData,
  Fee,
  FormDefinition,
} from "@xgovformbuilder/model";
import classNames from "classnames";
import { ErrorMessage } from "govuk-react-jsx";
import React from "react";

import { DataContext } from "../../context";
import { isEmpty } from "../../helpers";
import logger from "../../plugins/logger";
import { ValidationError } from "../FormComponent/componentReducer/componentReducer.validations";

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
  conditions: ConditionRawData[];
  ref: React.RefObject<FeeItems>;
  data: FormDefinition;
  fee: Fee;
  onEdit: ({ data }) => void;
}

interface State {
  items: Fee[];
  errors: ValidationError[];
}

export interface MissingError {
  href?: string;
  children?: string;
}

class FeeItems extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      items: props.items ? clone(props.items) : [],
      errors: [],
    };
  }

  validate = (form) => {
    let errors: ValidationError[] = [];
    const formData = new window.FormData(form);
    formData.getAll("description").forEach((d, i) => {
      if (isEmpty(d as string)) {
        errors.push({
          href: `#description-${i}`,
          children: "Enter description",
        });
      }
    });

    formData.getAll("condition").forEach((d, i) => {
      if (isEmpty(d as string)) {
        errors.push({
          href: `#condition-${i}`,
          children: "Select a condition",
        });
      }
    });

    formData.getAll("amount").forEach((d, i) => {
      if (((d as unknown) as number) < 0) {
        errors.push({
          href: `#amount-${i}`,
          children: "Enter a valid amount",
        });
      }
    });

    const descriptions = formData
      .getAll("description")
      .map((t) => (t as string).trim());
    const conditions = formData
      .getAll("condition")
      .map((t) => (t as string).trim());

    // Only validate dupes if there is more than one item
    if (descriptions.length >= 2 && headDuplicate(conditions)) {
      errors.push({
        href: "#items-table",
        children: "Duplicate conditions found in the list items",
      });
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
      items: this.state.items.filter((_s, i) => i !== idx),
      errors: [],
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

    const errorMessages = errors.map((value, index) => {
      return (
        <ErrorMessage key={`error-message-${index}`}>
          {value ? value.children : null}
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
                    id={`description-${index}`}
                    className={classNames({
                      "govuk-input": true,
                      "govuk-input--error": errors.find(
                        (err) =>
                          err.href && err.href.includes(`description-${index}`)
                      ),
                    })}
                    name="description"
                    type="text"
                    defaultValue={item.description}
                  />
                </td>
                <td className="govuk-table__cell">
                  <input
                    id={`amount-${index}`}
                    className={classNames({
                      "govuk-input": true,
                      "govuk-input--error": errors.find(
                        (err) =>
                          err.href && err.href.includes(`amount-${index}`)
                      ),
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
                      "govuk-input--error": errors.find(
                        (err) =>
                          err.href && err.href.includes(`condition-${index}`)
                      ),
                    })}
                    id={`condition-${index}`}
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
