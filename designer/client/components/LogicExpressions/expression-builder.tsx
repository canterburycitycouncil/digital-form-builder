import { LogicExpressionTypes } from "@xgovformbuilder/model";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

import { ExpressionBuilderActions } from "./expression-builder-actions";

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

export enum actionColor {
  "#8cd2ca" = "teal",
  "#dedede" = "grey",
  "#efb4c3" = "red",
  "#cae5ec" = "blue",
}

export const ExpressionBuilder: FC<Props> = ({
  expressionType,
  onExpressionChange,
}) => {
  const [inputResults, setInputResults] = useState<InputResult[]>();
  const [inputActions, setInputActions] = useState<actionType[]>([]);

  useEffect(() => {
    if (inputActions.length === 0) {
      if (expressionType === "literal") {
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
      } else if (expressionType === "mathematical") {
        setInputActions([
          { label: "text", color: "grey" },
          { label: "[variable]", color: "teal" },
          { label: "⮐", color: "red" },
        ]);
      }
    }
  }, [inputActions]);

  // manage changes in dragend state

  const handleDragEnd = (results: DropResult) => {
    let newIndices = 0;
    if (expressionType === "literal") {
      newIndices = 3;
    } else {
      newIndices = 8;
    }

    if (results.destination && inputResults) {
      let oldIndex = results.source.index;
      let newIndex = results.destination.index;
      let moveDifference = newIndex - oldIndex;
      let inputResultsCopy = [...inputResults];
      if (oldIndex < newIndices) {
        inputResultsCopy.push({
          type:
            inputActions[oldIndex].label === "[variable]"
              ? "variable"
              : "mathematical",
          color: actionColor[inputActions[oldIndex].color],
          label: inputActions[oldIndex].label,
          value: inputActions[oldIndex].label,
          order: newIndex,
          previousInputValue: "",
        });
      }
      inputResultsCopy = inputResultsCopy.map((result) => {
        let newResult = { ...result };
        if (newResult.order === oldIndex) {
          newResult.order = newIndex;
          return newResult;
        } else if (
          moveDifference > 0 &&
          newResult.order <= newIndex &&
          newResult.order > oldIndex
        ) {
          newResult.order = newResult.order - 1;
          return newResult;
        } else if (
          moveDifference < 0 &&
          newResult.order >= newIndex &&
          newResult.order < oldIndex
        ) {
          newResult.order = newResult.order + 1;
          return newResult;
        } else {
          return newResult;
        }
      });
      setInputResults(inputResultsCopy);
      onExpressionChange(getExpressionFromVariables(inputResultsCopy));
    }
  };

  const getExpressionFromVariables = (inputResults: InputResult[]): string => {
    let sortedInputs = [...inputResults].sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      } else if (a.order === b.order) {
        return 0;
      } else {
        return 1;
      }
    });
    return `${sortedInputs
      .map(
        (input) =>
          `${input.previousInputValue ? input.previousInputValue + " " : ""}${
            input.type === "mathematical"
              ? `[${input.value}]`
              : `{${input.value}}`
          } `
      )
      .join("")}`;
  };

  const changeLiteralValue = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const [name, order] = target.name.split("_");
    let formattedName = name.replace("-", " ");
    let formattedOrder = parseInt(order);
    if (inputResults) {
      let inputResultsCopy = { ...inputResults };
      const thisResultIndex = inputResultsCopy.findIndex(
        (result) =>
          result.value === formattedName && result.order === formattedOrder
      );
      inputResultsCopy[thisResultIndex] = {
        ...inputResultsCopy[thisResultIndex],
        value: target.value,
        label: target.value,
      };
      setInputResults(inputResultsCopy);
    }
  };

  return (
    <>
      <>This is using the expression builder original</>
      <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
        <div className="expressionBuilderDndArea">
          <ExpressionBuilderActions inputActions={inputActions} />
          <Droppable droppableId="expressionBuilderValuesArea">
            {(provided) => {
              <div
                ref={provided.innerRef}
                className="expressionBuilderValuesArea"
                {...provided.droppableProps}
              >
                {inputResults &&
                  inputResults.length > 0 &&
                  inputResults.map((result, index) => (
                    <>
                      {result.type === "literal" ? (
                        <div className="expressionBuilderValue literal">
                          <input
                            name={`${result.value.replace(" ", "-")}_${
                              result.order
                            }`}
                            value={result.value}
                            onChange={(e) => changeLiteralValue(e)}
                          />
                        </div>
                      ) : (
                        <Draggable
                          draggableId={`${result.value}_${result.order}`}
                          index={
                            expressionType === "literal" ? index + 3 : index + 8
                          }
                          key={`${result.value}_${result.order}`}
                        >
                          {(provided) => (
                            <div>
                              <button
                                className="expressionBuilderAction"
                                // style={{
                                //   backgroundColor: actionColor[result.color],
                                // }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span>{result.label}</span>
                              </button>
                            </div>
                          )}
                        </Draggable>
                      )}
                    </>
                  ))}
              </div>;
            }}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};
