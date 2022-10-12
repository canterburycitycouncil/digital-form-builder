import {
  allInputs,
  inputsAccessibleAt,
} from "@xgovformbuilder/designer/client/components/FormComponent/componentData";
import { findList } from "@xgovformbuilder/designer/client/components/List/data";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { Item } from "@xgovformbuilder/model";
import { nanoid } from "nanoid";
import React, { useContext, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineMode } from "react-icons/md";

import FormulaInputs from "./formula-inputs";

interface State {
  items: IItem[];
  selected: IItem[];
  isEditing: boolean;
  isComplete: boolean;
  editingId: string;
  id2List: {
    droppable: string;
    droppable2: string;
  };
}

interface EditorState {
  render: string;
  fields: any;
  selectedExpression?: Expression;
}

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

interface IItem {
  id: string | undefined;
  content: string | undefined;
  color: string;
}

export interface MoveResult {
  droppable: IItem[];
  droppable2: IItem[];
}

export interface FieldInputObject {
  [key: string]: FieldInput;
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

export enum actionColor {
  "teal" = "#8cd2ca",
  "grey" = "#dedede",
  "red" = "#efb4c3",
  "blue" = "#cae5ec",
  "orange" = "#F6B26B",
}

const cleanItems = (actionType): IItem[] => {
  return actionType.map((action) => ({
    content: action.label,
    // id: action.label,
    id: nanoid(),
    color: action.color,
  }));
};

/**
 * reorder the result of the move
 * */

const reorder = (
  list: IItem[],
  startIndex: number,
  endIndex: number
): IItem[] => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: IItem[],
  destination: IItem[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
): MoveResult | any => {
  const sourceClone = [...source];
  const destClone = [...destination];
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid: number = 8;

const getItemStyle = (
  draggableStyle: any,
  isDragging: boolean,
  color: string
): {} => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,
  background: isDragging ? "lightgrey" : actionColor[color],
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): {} => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 600,
  minHeight: 75,
  display: "flex",
});

function FormulaBuilder({ expressionState, setExpressionState, inputActions }) {
  const { data } = useContext(DataContext);

  const [state, setState] = useState<State>({
    items: cleanItems(inputActions),
    selected: [],
    isEditing: false,
    isComplete: false,
    editingId: "",
    id2List: {
      droppable: "items",
      droppable2: "selected",
    },
  });

  const [editorState, setEditorState] = useState<EditorState>({
    render: "standard",
    fields: Object.values(fieldsForPath()),
    selectedExpression: undefined,
  });

  const { isEditing, items, selected, id2List, editingId, isComplete } = state;

  function fieldsForPath(path) {
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

  function onEdit(e, id) {
    e.preventDefault();
    setState({
      ...state,
      isEditing: !isEditing,
      editingId: id,
    });
  }

  function onDelete(item) {
    // e.preventDefault();
    let filteredArray = selected.filter((select) => {
      return item.id !== select.id;
    });
    setState({
      ...state,
      selected: filteredArray,
    });
  }

  function getList(id: string): IItem[] {
    return state[id2List[id]];
  }

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const its = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === "droppable2") {
        setState({ ...state, selected: its });
      } else if (source.droppableId === "droppable") {
        setState({ ...state, items: its });
      }
    } else {
      const resultFromMove: MoveResult = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setState({
        ...state,
        items: resultFromMove.droppable,
        selected: resultFromMove.droppable2,
      });
    }
  }

  function cleanEditState(source, destination) {
    const resultFromMove: MoveResult = move(
      getList(source.droppableId),
      getList(destination.droppableId),
      source,
      destination
    );

    setState({
      ...state,
      items: resultFromMove.droppable,
      selected: resultFromMove.droppable2,
    });
  }

  useEffect(() => {
    if (selected.length === 0) {
      setState({
        ...state,
        items: cleanItems(inputActions),
      });
    }
  }, [inputActions]);

  const cleanState = selected.filter(
    (item) =>
      item.content !== "[variable]" &&
      item.content !== "number" &&
      item.content !== "text"
  );

  useEffect(() => {
    if (editorState.selectedExpression) {
      setState({
        ...state,
        items: cleanItems(inputActions),
        selected: [
          /**
           * cleanState will ensure that once an input action of type(number, text, variable) has completed a submit, it will scrub the value from the selected state
           */
          ...cleanState,
          /**
           * this below is adding the new card, value coming from a completed SaveValue or SelectValue which is saved to editor state in the formula inputs comp.
           */
          {
            id: nanoid(),
            content: editorState.selectedExpression?.label,
            color: "orange",
          },
        ],
      });
    }
  }, [editorState.selectedExpression]);

  // this hook updates the expressions "expressions" value, which populates the selected expressions state after a cleanup.
  useEffect(() => {
    setExpressionState({
      ...expressionState,
      expressions: selected,
    });
  }, [selected]);

  return (
    <>
      <div className="govuk-grid-column">
        <h2>Formula Builder</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="govuk-grid-column">
            <h3>Options</h3>
            <Droppable
              droppableId="droppable"
              direction="horizontal"
              /**
               * render clone is used to reparent and stop card position moving on drag. https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/reparenting.md
               */
              renderClone={(provided, snapshot, rubric) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  style={getItemStyle(
                    provided.draggableProps.style,
                    snapshot.isDragging,
                    ""
                  )}
                >
                  {items[rubric.source.index].content}
                </div>
              )}
            >
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      // key={randomId()}
                      draggableId={item.id}
                      index={index}
                      color={item.color}
                    >
                      {(
                        providedDraggable: DraggableProvided,
                        snapshotDraggable: DraggableStateSnapshot
                      ) => (
                        <div>
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            style={getItemStyle(
                              providedDraggable.draggableProps.style,
                              snapshotDraggable.isDragging,
                              item.color
                            )}
                          >
                            {item.content}
                          </div>
                          {providedDraggable.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="govuk-grid-column">
            <h3>Active</h3>
            <Droppable
              droppableId="droppable2"
              direction="horizontal"
              renderClone={(provided, snapshot, rubric) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  style={getItemStyle(
                    provided.draggableProps.style,
                    snapshot.isDragging,
                    ""
                  )}
                >
                  {selected[rubric.source.index].content}
                </div>
              )}
            >
              {(
                providedDroppable2: DroppableProvided,
                snapshotDroppable2: DroppableStateSnapshot
              ) => (
                <div
                  ref={providedDroppable2.innerRef}
                  style={getListStyle(snapshotDroppable2.isDraggingOver)}
                >
                  {selected.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      color={item.color}
                    >
                      {(
                        providedDraggable2: DraggableProvided,
                        snapshotDraggable2: DraggableStateSnapshot
                      ) => (
                        <div>
                          <div
                            ref={providedDraggable2.innerRef}
                            {...providedDraggable2.draggableProps}
                            {...providedDraggable2.dragHandleProps}
                            style={getItemStyle(
                              providedDraggable2.draggableProps.style,
                              snapshotDraggable2.isDragging,
                              item.color
                            )}
                          >
                            {item.content}
                            {item.content === "number" ||
                            item.content === "[variable]" ||
                            item.content === "text" ? (
                              <span>
                                <a
                                  href="#"
                                  className="govuk-link"
                                  onClick={(e) => onEdit(e, item.content)}
                                >
                                  <MdOutlineMode size={20} />
                                </a>
                              </span>
                            ) : null}
                            {item.content !== "+" &&
                            item.content !== "-" &&
                            item.content !== "X" &&
                            item.content !== "/" &&
                            item.content !== "(" &&
                            item.content !== "⮐" &&
                            item.content !== "number" &&
                            item.content !== "[variable]" &&
                            item.content !== "text" &&
                            item.content !== ")" ? (
                              <a
                                href="#"
                                className="govuk-link"
                                onClick={() => onDelete(item)}
                              >
                                <AiOutlineDelete size={20} />
                              </a>
                            ) : null}
                          </div>
                          {providedDraggable2.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {providedDroppable2.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>

      {isEditing && (
        <FormulaInputs
          setSelectedState={setState}
          selectedState={state}
          editingId={editingId}
          setEditorState={setEditorState}
          editorState={editorState}
          edit={onEdit}
        />
      )}
    </>
  );
}

export default FormulaBuilder;
