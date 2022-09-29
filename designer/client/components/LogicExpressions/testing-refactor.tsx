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
import TestingEditor from "./testing-editor";

interface Props {
  inputActions: actionType[];
}
// interface Items {
//   item: Item[];
// }

interface Item {
  id: string;
  content: string;
  color: string;
}

// interface IsEditing {
//   isEditing: boolean;
// }
interface MoveResult {
  droppable?: Item[];
  droppable2?: Item[];
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
  {
    //undef
    console.log(source);
    console.log(destination);
    //

    console.log(droppableSource);
    console.log(droppableDestination);
  }

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
  // const [state, setState] = useState<State[]>();
  const [list, setList] = useState<Item[]>(cleanItems(props.inputActions));
  const [selected, setSelected] = useState<Item[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  // const [moveResult, setMoveResult] = useState<MoveResult>();
  const [id2List, setId2List] = useState<MoveResult>({
    droppable: list,
    droppable2: selected,
  });

  // setState({
  //   items: cleanItems(props.inputActions),
  // });

  console.log(list);
  console.log(selected);
  // const [state, setState] = useState({
  //   items: cleanItems(props.inputActions),
  //   selected: ,
  //   isEditing: false,
  // });

  // let id2List = {
  //   droppable: "items",
  //   droppable2: "selected",
  // };

  // export default class Testing extends React.Component<Props, State> {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     items: cleanItems(props.inputActions),
  //     selected: [],
  //     isEditing: false,
  //   };

  // this.onDragEnd = this.onDragEnd.bind(this);

  // this.getList = this.getList.bind(this);

  // onEdit = (e) => {
  //   e.preventDefault();
  //   this.setState({
  //     isEditing: !this.state.isEditing,
  //   });
  // };

  const onEdit = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  const getList = (id: string): Item[] => {
    return id2List[id];
  };

  // const getList = (id: string): Item[] => {
  //   return items[id];
  // };

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;
    console.log(result);
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      // let state: State = { ...state };

      if (source.droppableId === "droppable2") {
        setList(list);
        // state = { ...state, selected: items };
      } else if (source.droppableId === "droppable") {
        setSelected(list);
        // state = { ...state, items };
      }

      // setState(state);
    } else {
      console.log("1", getList(source.droppableId));
      console.log("2", source.droppableId);
      console.log("3", getList(destination.droppableId));
      console.log("4", destination.droppableId);

      const resultFromMove: MoveResult = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setList(resultFromMove.droppable || []);
      setSelected(resultFromMove.droppable2 || []);

      // setState({
      //   setItems: resultFromMove.droppable,
      //   setSelected: resultFromMove.droppable2,
      // });
    }
  }
  // render() {
  // const { isEditing } = this.state;

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
                  {list?.map((item, index) => (
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
                  {selected?.map((item, index) => (
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

      {isEditing && <TestingEditor />}
    </>
  );
}

export default TestingRefactor;
