import { DataContext } from "@xgovformbuilder/designer/client/context";
import React from "react";
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

interface Props {
  inputActions: actionType[];
}

interface Item {
  id: string;
  content: string;
  color: string;
}
interface DragState {
  items: Item[];
  selected: Item[];
}
interface MoveResult {
  droppable: Item[];
  droppable2: Item[];
}

export enum actionColor {
  "teal" = "#8cd2ca",
  "grey" = "#dedede",
  "red" = "#efb4c3",
  "blue" = "#cae5ec",
}

// const getTestItems = (count: number, offset: number = 0): Item[] => {
//   return Array.from({ length: count }, (v, k) => k).map((k) => ({
//     content: `item ${k + offset}`,
//     id: `item-${k + offset}`,
//   }));
// };

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

export default class Testing extends React.Component<Props, DragState> {
  static contextType = DataContext;

  id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  constructor(props) {
    super(props);

    this.state = {
      items: cleanItems(props.inputActions),
      // items: getTestItems(10, 0),
      selected: [],
    };

    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
  }

  getList(id: string): Item[] {
    return this.state[this.id2List[id]];
  }

  onDragEnd(result: DropResult): void {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state: DragState = { ...this.state };

      if (source.droppableId === "droppable2") {
        state = { ...this.state, selected: items };
      } else if (source.droppableId === "droppable") {
        state = { ...this.state, items };
      }

      this.setState(state);
    } else {
      const resultFromMove: MoveResult = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: resultFromMove.droppable,
        selected: resultFromMove.droppable2,
      });
    }
  }

  render() {
    return (
      <div className="govuk-grid-column">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="govuk-grid-column">
            <h2>Options</h2>
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
                  {this.state.items.map((item, index) => (
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

          <h2>Active</h2>
          <Droppable droppableId="droppable2" direction="horizontal">
            {(
              providedDroppable2: DroppableProvided,
              snapshotDroppable2: DroppableStateSnapshot
            ) => (
              <div
                ref={providedDroppable2.innerRef}
                style={getListStyle(snapshotDroppable2.isDraggingOver)}
              >
                {this.state.selected.map((item, index) => (
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
        </DragDropContext>
      </div>
    );
  }
}
