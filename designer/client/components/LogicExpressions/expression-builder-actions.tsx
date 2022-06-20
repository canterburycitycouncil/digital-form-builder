import React, { FC } from "react";
import { Draggable } from "react-beautiful-dnd";

import { actionColor, actionType } from "./expression-builder";

interface Props {
  inputActions: actionType[];
}

export const ExpressionBuilderActions: FC<Props> = ({ inputActions }) => {
  return (
    <>
      <div className="expressionBuilderActionsContainer">
        {inputActions.map((action, index) => (
          <Draggable
            draggableId={`${action.label}`}
            index={index}
            key={`${action.label}`}
          >
            {(provided) => (
              <button
                className="expressionBuilderAction"
                style={{
                  backgroundColor: actionColor[action.color],
                }}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <span>{action.label}</span>
              </button>
            )}
          </Draggable>
        ))}
      </div>
    </>
  );
};
