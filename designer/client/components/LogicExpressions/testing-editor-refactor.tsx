import {
  allInputs,
  inputsAccessibleAt,
} from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { findList } from "@xgovformbuilder/designer/client/components/List/data";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { Item } from "@xgovformbuilder/model";
import React, { useContext, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";

interface Props {}

interface State {
  render: string;
  fields: any;
  selectedExpression?: Expression;
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
  values?: string[];
}

export interface Expression {
  name: string;
  label: string;
  type: string;
}

export interface FieldInputObject {
  [key: string]: FieldInput;
}

function TestingEditorRefactor(props) {
  const { data } = useContext(DataContext);
  const [state, setState] = useState<State>({
    render: "standard",
    fields: Object.values(fieldsForPath(null)),
    selectedExpression: undefined,
  });

  const onClickRender = (e, content) => {
    e.preventDefault();
    setState({
      ...state,
      render: content,
    });
    console.log("sup gee ya on on click");
  };

  const onSelect = (e, input) => {
    e.preventDefault();
    setState({
      ...state,
      selectedExpression: input,
    });
    console.log("hey you're up on the onSelect");
  };

  /**
   * imported function from conditions edit to get all the possible conditions.
   */

  function fieldsForPath(path) {
    // if data here is the same as 'data as FormDefinition'
    if (data) {
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
      const conditionsInputs: FieldInput[] = data.conditions.map(
        (condition) => ({
          label: condition.displayName,
          name: condition.name,
          type: "Condition",
        })
      );

      return fieldInputs
        .concat(conditionsInputs)
        .reduce<FieldInputObject>((obj, item) => {
          obj[item.name] = item;
          return obj;
        }, {});
    }
  }
  // render() {
  // const { render, fields } = this.state;

  // {
  // console.log(this.state.selectedExpression);
  // }

  return (
    // <div className="govuk-width-container">
    //   <a href="/#" className="govuk-back-link">
    //     Back
    //   </a>

    // <main className="govuk-main-wrapper">
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h3>{state.selectedExpression?.label}</h3>
        <nav className="menu">
          <div className="menu-row">
            <button
              className="govuk-button govuk-button--secondary"
              onClick={(e) => onClickRender(e, "standard")}
            >
              Standard
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={(e) => onClickRender(e, "logic")}
            >
              Logic
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={(e) => onClickRender(e, "definition")}
            >
              Definition
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={(e) => onClickRender(e, "question")}
            >
              Question
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={(e) => onClickRender(e, "answers")}
            >
              Answers
            </button>
          </div>
        </nav>

        <div className="govuk-body">
          <table className="govuk-table">
            {/* <caption className="govuk-table__caption govuk-table__caption--m">
                {render}
              </caption> */}
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
              {/* {console.log(fields)} */}
              {state.fields.map((field) => (
                <tr key={field.name} className="govuk-table__row">
                  <th scope="row" className="govuk-table__header">
                    {field.label}
                  </th>
                  <td className="govuk-table__cell">
                    <a
                      href="#"
                      className="govuk-link"
                      onClick={(e) => onSelect(e, field)}
                    >
                      <AiOutlineFileAdd />
                      Add
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // </main>
    // </div>
  );
}

// TestingEditorRefactor.contextType = DataContext;
export default TestingEditorRefactor;
