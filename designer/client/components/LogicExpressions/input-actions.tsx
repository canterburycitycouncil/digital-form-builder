import React from "react";

import FormulaBuilder from "./formula-builder";

export interface actionType {
  label: string;
  color: "teal" | "grey" | "red" | "blue" | "orange";
}

function initialInputActions(expressionType: string): actionType[] {
  if (expressionType === "mathematical") {
    return [
      { label: "[variable]", color: "teal" },
      { label: "number", color: "red" },
      { label: "+", color: "grey" },
      { label: "-", color: "grey" },
      { label: "X", color: "grey" },
      { label: "/", color: "grey" },
      { label: "(", color: "blue" },
      { label: ")", color: "blue" },
    ] as actionType[];
  }
  if (expressionType === "literal") {
    return [
      { label: "text", color: "grey" },
      { label: "[variable]", color: "teal" },
      { label: "⮐", color: "red" },
    ] as actionType[];
  } else {
    return [];
  }
}

function InputActions({ expressionState }) {
  return (
    <FormulaBuilder
      expressionState={expressionState}
      inputActions={initialInputActions(expressionState.expressionType)}
    />
  );
}

export default InputActions;
