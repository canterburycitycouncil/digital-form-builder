import { DataContext } from "@xgovformbuilder/designer/client/context";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { clone } from "@xgovformbuilder/model";
import React, { ChangeEvent, MouseEvent } from "react";

type State = {
  items: {
    item: string;
    value: string;
  }[];
};

type Props = {
  data: any; // TODO: type
  items?: {
    item: string;
    value: string;
  }[];
  values: { name: string; display: string }[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onItemDelete: (propertyName: string) => void;
  onItemAdd: (propertyName: string, value: any) => void;
};

class NotifyItems extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props: Props) {
    super(props);
    console.log(props.items);
    this.state = {
      items: props.items ? clone(props.items) : [],
    };
  }

  onClickAddItem = (e: MouseEvent) => {
    e.preventDefault();
    let newItems = [
      ...this.state.items,
      {
        item: "",
        value: "",
      },
    ];
    this.setState({
      items: newItems,
    });
    this.props.onItemAdd("personalisation", newItems);
  };

  removeItem = (idx: number) => {
    this.setState({
      items: this.state.items.filter((_s, i) => i !== idx),
    });
    this.props.onItemDelete(`personalisation.${idx}`);
  };

  onClickDelete = (event: MouseEvent) => {
    event.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { data } = this.props;
    const { save } = this.context;
    const copy = clone(data);

    save(copy).catch((err) => {
      logger.error("NotifyItems", err);
    });
  };

  onChangeItem = (event: ChangeEvent<HTMLSelectElement>, index: number) => {
    const { items } = this.state;
    items[index].item = event.target.value;
    this.setState({
      items,
    });

    if (
      items.find(
        (item, itemIndex) =>
          item.item === event.target.value && itemIndex !== index
      )
    ) {
      event.target.setCustomValidity(
        "Duplicate conditions found in the list items"
      );
    } else {
      event.target.setCustomValidity("");
    }
    this.props.onChange(event);
  };

  onChangeValue = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { items } = this.state;

    items[index].value = event.target.value;

    if (
      items.find(
        (item, itemIndex) =>
          item.value === event.target.value && itemIndex !== index
      )
    ) {
      event.target.setCustomValidity(
        "Duplicate variable names found in list items"
      );
    } else {
      event.target.setCustomValidity("");
    }
    this.props.onChange(event);
  };

  render() {
    const { items } = this.state;
    const { values } = this.props;

    return (
      <table className="govuk-table">
        <caption className="govuk-table__caption">
          Notify personalisations
          <span className="govuk-hint">
            Notify template keys must match the personalisations in the GOV.UK
            Notify template.
          </span>
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th className="govuk-table__header" scope="col">
              Description
            </th>
            <th className="govuk-table__header" scope="col">
              Notify template key
            </th>
            <th className="govuk-table__header" scope="col">
              <a className="pull-right" href="#" onClick={this.onClickAddItem}>
                Add
              </a>
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {items.map((item, index) => (
            <tr key={item.item + index} className="govuk-table__row">
              <td className="govuk-table__cell">
                <select
                  className="govuk-select"
                  id={`personalisation.${index}.item`}
                  name={`personalisation.${index}.item`}
                  value={item.item}
                  onChange={(e) => this.onChangeItem(e, index)}
                  required
                >
                  <option />
                  {values.map((value, i) => (
                    <option key={value.name + i} value={value.name}>
                      {value.display ?? value.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="govuk-table__cell">
                <input
                  className="govuk-input"
                  id={`personalisation.${index}.value`}
                  name={`personalisation.${index}.value`}
                  type="text"
                  value={item.value}
                  onChange={(e) => this.onChangeValue(e, index)}
                />
              </td>
              <td className="govuk-table__cell" width="20px">
                <a
                  className="list-item-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    this.removeItem(index);
                  }}
                >
                  &#128465;
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default NotifyItems;
