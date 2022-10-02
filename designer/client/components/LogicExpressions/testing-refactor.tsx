import { EditIcon } from "@xgovformbuilder/designer/client/components/Icons";
import React, { useState } from "react";
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

import { actionType } from "./dragdrop";
import TestingEditorRefactor from "./testing-editor-refactor";

interface Props {
  inputActions: actionType[];
}

interface State {
  items: Item[];
  selected: Item[];
  isEditing: boolean;
  id2List: {
    droppable: string;
    droppable2: string;
  };
}

interface Item {
  id: string;
  content: string;
  color: string;
}

export interface MoveResult {
  droppable: Item[];
  droppable2: Item[];
}

export enum actionColor {
  "teal" = "#8cd2ca",
  "grey" = "#dedede",
  "red" = "#efb4c3",
  "blue" = "#cae5ec",
}

const cleanItems = (actionType): Item[] => {
  return actionType.map((action) => ({
    content: action.label,
    id: action.label,
    color: action.color,
  }));
};

/**
 * reorder the result of the move
 * */

const reorder = (
  list: Item[],
  startIndex: number,
  endIndex: number
): Item[] => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: Item[],
  destination: Item[],
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
  //colour change on dragging
  background: isDragging ? "lightgreen" : actionColor[color],
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): {} => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 600,
  minHeight: 75,
  display: "flex",
});

function TestingRefactor(props) {
  const [state, setState] = useState<State>({
    items: cleanItems(props.inputActions),
    selected: [],
    isEditing: false,
    id2List: {
      droppable: "items",
      droppable2: "selected",
    },
  });

  const { isEditing, items, selected, id2List } = state;

  function onEdit(e) {
    e.preventDefault();
    setState({
      ...state,
      isEditing: !isEditing,
    });
  }

  function getList(id: string): Item[] {
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

  return (
    <>
      <div className="govuk-grid-column">
        <h2>Formula Builder</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="govuk-grid-column">
            <h3>Options</h3>
            <Droppable droppableId="droppable" direction="horizontal">
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
            <Droppable droppableId="droppable2" direction="horizontal">
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
                            {item.id === "number" ||
                            item.id === "[variable]" ||
                            item.id === "text" ? (
                              <span>
                                <a
                                  href="#"
                                  className="govuk-link"
                                  onClick={(e) => onEdit(e)}
                                >
                                  <EditIcon bottom={true} />
                                </a>
                              </span>
                            ) : null}
                            {item.content}
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

      {isEditing && <TestingEditorRefactor />}
    </>
  );
}

export default TestingRefactor;
