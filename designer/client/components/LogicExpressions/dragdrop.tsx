import { LogicExpressionTypes } from "@xgovformbuilder/model";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";

// import { ExpressionBuilderActions } from "./expression-builder-actions";
import Testing from "./testing";

// enum ListsNames {
//   Items = "items",
//   Selected = "selected",
// }

export enum actionColor {
  "#8cd2ca" = "teal",
  "#dedede" = "grey",
  "#efb4c3" = "red",
  "#cae5ec" = "blue",
}

interface Props {
  expression: string;
  expressionType: LogicExpressionTypes;
  // onExpressionChange: Dispatch<SetStateAction<string>>;
}

// interface InputResult {
//   type: "variable" | "literal" | "mathematical";
//   color: actionColor;
//   value: string;
//   label: string;
//   order: number;
//   previousInputValue: string;
// }

export interface actionType {
  label: string;
  color: "teal" | "grey" | "red" | "blue";
  id: string;
}

export interface resultType {
  label: string;
}

export interface itemType {
  columns: object;
  columnOrder: string;
}

export const DragDrop: FC<Props> = ({
  expressionType,
  // , onExpressionChange
}) => {
  // const [inputResults, setInputResults] = useState<InputResult[]>([]);
  const [inputActions, setInputActions] = useState<actionType[]>([]);

  useEffect(() => {
    // if (inputActions.length === 0) {
    if (expressionType === "mathematical") {
      setInputActions([
        { label: "[variable]", color: "teal", id: "1" },
        { label: "number", color: "red", id: "2" },
        { label: "+", color: "grey", id: "3" },
        { label: "-", color: "grey", id: "4" },
        { label: "X", color: "grey", id: "5" },
        { label: "/", color: "grey", id: "6" },
        { label: "(", color: "blue", id: "7" },
        { label: ")", color: "blue", id: "8" },
      ]);
    } else if (expressionType === "literal") {
      setInputActions([
        { label: "text", color: "grey", id: "9" },
        { label: "[variable]", color: "teal", id: "10" },
        { label: "⮐", color: "red", id: "11" },
      ]);
    }
    // }
  }, [expressionType]);

  // const handleDragEnd = (results: DropResult) => {
  //   console.log(results);
  //   if (!results.destination) return;
  //   const items = Array.from(inputActions);
  //   const [reorderedActions] = items.splice(results.source.index, 1);
  //   items.splice(results.destination.index, 0, reorderedActions);
  //   setInputActions(items);
  // };

  return (
    <>
      <Testing inputActions={inputActions} />

      {/* <div className="expressionBuilderDndArea">
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
      </div> */}
    </>
  );
};
