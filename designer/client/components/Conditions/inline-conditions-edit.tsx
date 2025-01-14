import {
  EditIcon,
  MoveDownIcon,
  MoveUpIcon,
} from "@xgovformbuilder/designer/client/components/Icons";
import {
  clone,
  Condition,
  ConditionsModel,
  toPresentationString,
} from "@xgovformbuilder/model";
import React from "react";

import { FieldInputObject } from "./InlineConditions";
import InlineConditionsDefinition from "./InlineConditionsDefinition";

interface Props {
  conditions: ConditionsModel;
  cancelCallback: () => void;
  saveCallback?: (conditions: ConditionsModel) => void;
  fields: FieldInputObject;
}

interface State {
  conditions: ConditionsModel;
  selectedConditions: number[];
  condition?: Condition;
  editingError?: string;
  editingIndex?: number;
}

class InlineConditionsEdit extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      conditions: props.conditions,
      selectedConditions: [],
    };
  }

  onChangeCheckbox = (e) => {
    let copy = clone(this.state.selectedConditions ?? []);
    const index = Number(e.target.value);
    if (e.target.checked) {
      copy.push(index);
    } else {
      copy = copy.filter((it) => it !== index);
    }
    this.setState(
      {
        selectedConditions: copy,
      },
      () => {}
    );
  };

  // onClickGroup = (e) => {
  //   e?.preventDefault();
  //   if (this.state.selectedConditions?.length < 2) {
  //     this.setState(
  //       {
  //         editingError: "Please select at least 2 items for grouping",
  //       },
  //       () => {}
  //     );
  //   } else {
  //     const groups = this.groupWithConsecutiveConditions(
  //       this.state.selectedConditions
  //     );
  //     if (groups.find((group) => group.length === 1)) {
  //       this.setState(
  //         {
  //           editingError: "Please select consecutive items to group",
  //         },
  //         () => {}
  //       );
  //     } else {
  //       this.setState(
  //         {
  //           editingError: undefined,
  //           selectedConditions: [],
  //           conditions: this.state.conditions.addGroups(
  //             groups
  //               .sort((a, b) => a - b)
  //               .reduce((groupDefs, group) => {
  //                 groupDefs.push(
  //                   new ConditionGroupDef(group[0], group[group.length - 1])
  //                 );
  //                 return groupDefs;
  //               }, [])
  //           ),
  //         },
  //         () => {}
  //       );
  //     }
  //   }
  // };

  onClickRemove = (e) => {
    e?.preventDefault();
    if (this.state.selectedConditions?.length < 1) {
      this.setState(
        {
          editingError: "Please select at least 1 item to remove",
        },
        () => {}
      );
    } else {
      this.setState(
        {
          editingError: undefined,
          selectedConditions: [],
          conditions: this.state.conditions.remove(
            this.state.selectedConditions
          ),
          condition: undefined,
        },
        () => {}
      );
    }
    if (!this.state.conditions.hasConditions) {
      this.props.cancelCallback();
    }
  };

  // groupWithConsecutiveConditions(selectedConditions: number[]) {
  //   const result: ConditionGroupDef[] = [];
  //   selectedConditions.sort((a, b) => a - b);
  //   selectedConditions.forEach((condition) => {
  //     const groupForCondition = result.find(
  //       (group) =>
  //         group.contains(condition - 1) || group.contains(condition + 1)
  //     );
  //     if (groupForCondition) {
  //       groupForCondition.push(condition);
  //     } else {
  //       result.push([condition]);
  //     }
  //   });
  //   return result;
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.conditions !== this.props.conditions) {
      this.setState(
        {
          conditions: this.props.conditions,
          selectedConditions: [],
        },
        () => {}
      );
    }
  }

  onClickCancelEditView = (e) => {
    e?.preventDefault();
    this.setState(
      {
        selectedConditions: [],
        editingIndex: undefined,
      },
      () => {}
    );
    this.props.cancelCallback();
  };

  onClickSplit(index) {
    this.setState(
      {
        conditions: this.state.conditions.splitGroup(index),
      },
      () => {}
    );
  }

  onClickEdit(index) {
    const conditions = this.state.conditions.asPerUserGroupings;
    if (conditions.length > index) {
      this.setState(
        {
          editingIndex: index,
          condition: Object.assign({}, conditions[index]),
        },
        () => {}
      );
    }
  }

  moveConditionEarlier = (event) => {
    event.preventDefault();
    const index = event.currentTarget.dataset.index;
    const conditions = this.state.conditions.moveEarlier(index);
    this.setState(
      {
        conditions,
        selectedConditions: [],
      },
      () => {}
    );
  };

  moveConditionLater = (event) => {
    event.preventDefault();
    const index = event.currentTarget.dataset.index;
    const conditions = this.state.conditions.moveLater(index);
    this.setState(
      {
        conditions,
        selectedConditions: [],
      },
      () => {}
    );
  };

  setState(state, callback) {
    if (state.conditions && this.props.saveCallback) {
      this.props.saveCallback(state.conditions);
    }
    super.setState(state, callback);
  }

  saveCondition = (condition) => {
    this.setState(
      {
        conditions: this.state.conditions.replace(
          this.state.editingIndex as number,
          condition
        ),
        condition: undefined,
        editingIndex: undefined,
      },
      () => {}
    );
  };

  render() {
    const {
      conditions,
      condition,
      editingIndex,
      editingError,
      selectedConditions,
    } = this.state;

    return (
      <div id="edit-conditions">
        {!editingIndex && editingIndex !== 0 && (
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
              Amend conditions
            </legend>
            {editingError && (
              <span id="conditions-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>{" "}
                {editingError}
              </span>
            )}
            <div id="editing-checkboxes" className="govuk-checkboxes">
              {conditions.asPerUserGroupings.map((listCondition, index) => {
                return (
                  <div
                    key={`condition-checkbox-${index}`}
                    className="govuk-checkboxes__item"
                    style={{ display: "flex" }}
                  >
                    <input
                      type="checkbox"
                      className="govuk-checkboxes__input"
                      id={`condition-${index}`}
                      name={`condition-${index}`}
                      value={index}
                      onChange={this.onChangeCheckbox}
                      checked={selectedConditions?.includes(index) || false}
                    />
                    <label
                      className="govuk-label govuk-checkboxes__label"
                      htmlFor={`condition-${index}`}
                    >
                      {toPresentationString(listCondition)}
                    </label>
                    <span
                      id={`condition-${index}-actions`}
                      style={{ display: "inline-flex", flexGrow: 1 }}
                    >
                      {listCondition.isGroup() && (
                        <span style={{ flexGrow: 1 }}>
                          <a
                            href="#"
                            id={`condition-${index}-split`}
                            className="govuk-link"
                            onClick={(e) => {
                              e.preventDefault();
                              this.onClickSplit(index);
                            }}
                          >
                            Split
                          </a>
                        </span>
                      )}
                      {!listCondition.isGroup() && (
                        <span style={{ flexGrow: 1 }}>
                          <a
                            href="#"
                            id={`condition-${index}-edit`}
                            className="govuk-link"
                            onClick={(e) => {
                              e.preventDefault();
                              this.onClickEdit(index);
                            }}
                          >
                            <EditIcon bottom={true} />
                          </a>
                        </span>
                      )}
                      {index > 0 && (
                        <span>
                          <a
                            href="#"
                            id={`condition-${index}-move-earlier`}
                            data-index={index}
                            onClick={this.moveConditionEarlier}
                          >
                            <MoveUpIcon />
                          </a>
                        </span>
                      )}
                      {index < conditions.lastIndex && (
                        <span>
                          <a
                            href="#"
                            className="govuk-link"
                            id={`condition-${index}-move-later`}
                            data-index={index}
                            onClick={this.moveConditionLater}
                          >
                            <MoveDownIcon />
                          </a>
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="govuk-form-group" id="group-and-remove">
              {/* {selectedConditions?.length > 1 && (
                <span>
                  <a
                    href="#"
                    id="group-conditions"
                    className="govuk-link"
                    onClick={this.onClickGroup}
                  >
                    Group
                  </a>{" "}
                  /
                </span>
              )} */}
              {selectedConditions?.length > 0 && (
                <a
                  href="#"
                  id="remove-conditions"
                  className="govuk-link"
                  onClick={this.onClickRemove}
                >
                  Remove
                </a>
              )}
            </div>
          </fieldset>
        )}
        {editingIndex !== undefined && editingIndex >= 0 && condition && (
          <InlineConditionsDefinition
            expectsCoordinator={editingIndex > 0}
            fields={this.props.fields}
            condition={condition}
            saveCallback={this.saveCondition}
          />
        )}
        <div className="govuk-form-group">
          <a
            href="#"
            id="cancel-edit-inline-conditions-link"
            className="govuk-link"
            onClick={this.onClickCancelEditView}
          >
            Finished editing
          </a>
        </div>
      </div>
    );
  }
}

export default InlineConditionsEdit;
