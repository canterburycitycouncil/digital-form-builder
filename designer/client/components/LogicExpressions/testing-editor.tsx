import {
  allInputs,
  inputsAccessibleAt,
} from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { findList } from "@xgovformbuilder/designer/client/components/List/data";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { Item } from "@xgovformbuilder/model";
import React from "react";
import { AiOutlineFileAdd } from "react-icons/ai";

interface Props {}

interface State {
  render: string;
  fields: any;
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

export interface FieldInput {
  label: string;
  name: string;
  type: string;
  values: string[];
}

export interface FieldInputObject {
  [key: string]: FieldInput;
}

class TestingEditor extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      render: "standard",
      fields: Object.values(this.fieldsForPath(null)),
    };
  }
  onClickRender = (e, content) => {
    e.preventDefault();
    this.setState({
      render: content,
    });
    console.log("sup gee");
  };

  /**
   * imported function from conditions edit to get all the possible conditions.
   */

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

  render() {
    const { render, fields } = this.state;
    {
      console.log(fields);
    }
    return (
      <div className="govuk-width-container">
        <a href="/#" className="govuk-back-link">
          Back
        </a>

        <main className="govuk-main-wrapper">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h1 className="govuk-heading-xl">Insert Variable</h1>
              <nav className="menu">
                <div className="menu-row">
                  <button
                    className="govuk-button"
                    onClick={(e) => this.onClickRender(e, "standard")}
                  >
                    Standard
                  </button>
                  <button
                    className="govuk-button"
                    onClick={(e) => this.onClickRender(e, "logic")}
                  >
                    Logic
                  </button>
                  <button
                    className="govuk-button"
                    onClick={(e) => this.onClickRender(e, "definition")}
                  >
                    Definition
                  </button>
                  <button
                    className="govuk-button"
                    onClick={(e) => this.onClickRender(e, "question")}
                  >
                    Question
                  </button>
                  <button
                    className="govuk-button"
                    onClick={(e) => this.onClickRender(e, "answers")}
                  >
                    Answers
                  </button>
                </div>
              </nav>

              <div className="govuk-body">
                <table className="govuk-table">
                  <caption className="govuk-table__caption govuk-table__caption--m">
                    {render}
                  </caption>
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th scope="col" className="govuk-table__header">
                        Name
                      </th>
                      <th scope="col" className="govuk-table__header">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body">
                    {console.log(fields)}
                    {fields.map((field) => (
                      <tr key={field.name} className="govuk-table__row">
                        <th scope="row" className="govuk-table__header">
                          {field.label}
                        </th>
                        <td className="govuk-table__cell">
                          <a
                            href="#"
                            className="govuk-link"
                            onClick={(e) => console.log(e)}
                          >
                            <AiOutlineFileAdd />
                            Add {field.label}
                          </a>
                        </td>
                      </tr>
                    ))}

                    {/* {fields.map((item) => {})} */}

                    {/* <tr className="govuk-table__row">
                      <th scope="row" className="govuk-table__header">
                        First 6 weeks
                      </th>
                      <td className="govuk-table__cell">£109.80 per week</td>
                    </tr>

                    <tr className="govuk-table__row">
                      <th scope="row" className="govuk-table__header">
                        Next 33 weeks
                      </th>
                      <td className="govuk-table__cell">£109.80 per week</td>
                    </tr>

                    <tr className="govuk-table__row">
                      <th scope="row" className="govuk-table__header">
                        Total estimated pay
                      </th>
                      <td className="govuk-table__cell">£4,282.20</td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

TestingEditor.contextType = DataContext;
export default TestingEditor;
