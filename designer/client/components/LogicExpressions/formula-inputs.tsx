import React, { useState } from "react";
import { AiOutlineEnter, AiOutlineFileAdd } from "react-icons/ai";

export interface State {
  inputValue: string;
}

function FormulaInputs({
  setEditorState,
  editorState,
  edit,
  updating,
  editingId,
  selectedState,
  setSelectedState,
}) {
  const [state, setState] = useState<State>({
    inputValue: "",
  });

  const { inputValue } = state;

  const updateCard = selectedState.selected.filter((item) => {
    return item.id !== selectedState.updateId;
  });

  /**
   * if statement will update the value of an exisiting card through the value in updateCard. Otherwise it's creating a new card through setting an editor state, and a useEffect trigger in formulaBuilder comp.
   */

  function onSelectVariable(e, input, editingId) {
    if (!selectedState.updateId) {
      setEditorState({
        ...editorState,
        selectedExpression: {
          label: input.label,
          type: editingId,
        },
      }),
        setSelectedState({
          ...selectedState,
          isComplete: !selectedState.isComplete,
          isEditing: !selectedState.isEditing,
        });
      edit(e);
    } else {
      setEditorState({
        ...editorState,
        selectedExpression: {
          label: input.label,
          type: editingId,
        },
      }),
        setSelectedState({
          ...selectedState,
          selected: updateCard,
          isUpdating: !selectedState.isUpdating,
          updateId: "",
        });
      updating(e);
    }
  }

  function onSaveValue(e) {
    e.preventDefault();

    setEditorState({
      ...editorState,
      selectedExpression: {
        label: inputValue,
        name: inputValue,
      },
    });
    setState({ inputValue: "" });
    edit(e);
  }

  return editingId === "[variable]" ? (
    <div className="govuk-grid-column">
      <h3>Input</h3>
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-body">
          <table className="govuk-table">
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
              {editorState.fields.map((field) => (
                <tr key={field.name} className="govuk-table__row">
                  <th scope="row" className="govuk-table__header">
                    {field.label}
                  </th>
                  <td className="govuk-table__cell">
                    <a
                      href="#"
                      className="govuk-link"
                      onClick={(e) => onSelectVariable(e, field, editingId)}
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
  ) : (
    <div className="govuk-grid-column">
      <div className="govuk-form-group">
        <h3>Input</h3>
        <div id="editor-name-hint" className="govuk-hint">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
        <div className="govuk-input__wrapper">
          <input
            id="formula-inputs-input"
            name="input"
            className="govuk-input govuk-!-width-one-half"
            value={inputValue}
            onChange={(e) => setState({ inputValue: e.target.value })}
          />
          <div className="govuk-input__suffix">
            <button onClick={onSaveValue}>
              <AiOutlineEnter />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormulaInputs;
