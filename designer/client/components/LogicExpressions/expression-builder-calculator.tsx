import React, { FC } from "react";
import { Draggable } from "react-beautiful-dnd";

import { actionType } from "./dragdrop";

interface Props {
  inputActions: actionType[];
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  padding: 10,
  margin: `10px`,
  background: isDragging ? "#4a2975" : "white",
  color: isDragging ? "white" : "black",
  border: `1px solid black`,
  borderRadius: `5px`,
  ...draggableStyle,
});

export const ExpressionBuilderCalculator: FC<Props> = ({ inputActions }) => {
  console.log(inputActions);
  return (
    <>
      <div className="expressionBuilderActionsContainer">
        <h2>Building Area</h2>

        {inputActions?.map((action, index) => {
          return (
            <Draggable
              draggableId={`${action.label}`}
              index={index}
              key={`${action.label}`}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  {action.label}
                </div>
              )}
            </Draggable>
          );
        })}
      </div>
    </>
  );
};
