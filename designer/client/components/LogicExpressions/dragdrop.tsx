import { LogicExpressionTypes } from "@xgovformbuilder/model";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import { ExpressionBuilderActions } from "./expression-builder-actions";

enum ListsNames {
  Items = "items",
  Selected = "selected",
}

export enum actionColor {
  "#8cd2ca" = "teal",
  "#dedede" = "grey",
  "#efb4c3" = "red",
  "#cae5ec" = "blue",
}

interface Props {
  expression: string;
  expressionType: LogicExpressionTypes;
  onExpressionChange: Dispatch<SetStateAction<string>>;
}

interface InputResult {
  type: "variable" | "literal" | "mathematical";
  color: actionColor;
  value: string;
  label: string;
  order: number;
  previousInputValue: string;
}

export interface actionType {
  label: string;
  color: "teal" | "grey" | "red" | "blue";
}

export interface resultType {
  label: string;
}

export interface itemType {
  columns: object;
  columnOrder: string;
}

let item = {
  columns: {
    columnOne: {
      id: "column-1",
      title: "Actions",
      expressionIds: [],
    },
    columnTwo: {
      id: "column-2",
      title: "Live",
      expressionIds: [],
    },
  },
  columnOrder: "columnOne",
};

export const DragDrop: FC<Props> = ({ expressionType, onExpressionChange }) => {
  const [inputResults, setInputResults] = useState<InputResult[]>([]);
  const [inputActions, setInputActions] = useState<actionType[]>([]);

  useEffect(() => {
    // if (inputActions.length === 0) {
    if (expressionType === "mathematical") {
      setInputActions([
        { label: "[variable]", color: "teal" },
        { label: "number", color: "red" },
        { label: "+", color: "grey" },
        { label: "-", color: "grey" },
        { label: "X", color: "grey" },
        { label: "/", color: "grey" },
        { label: "(", color: "blue" },
        { label: ")", color: "blue" },
      ]);
    } else if (expressionType === "literal") {
      setInputActions([
        { label: "text", color: "grey" },
        { label: "[variable]", color: "teal" },
        { label: "⮐", color: "red" },
      ]);
    }
    // }
  }, [expressionType]);

  const handleDragEnd = (results: DropResult) => {
    console.log(results);
    if (!results.destination) return;
    const items = Array.from(inputActions);
    const [reorderedActions] = items.splice(results.source.index, 1);
    items.splice(results.destination.index, 0, reorderedActions);
    setInputActions(items);
  };

  return (
    <>
      <div className="expressionBuilderDndArea">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
            <Droppable droppableId="expressionbuildervalues">
              {(provided, snapshot) => (
                <ul
                  className={`expressionbuildervalues ${
                    snapshot.isDraggingOver ? "dragactive" : " "
                  }`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <ExpressionBuilderActions inputActions={inputActions} />

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};
