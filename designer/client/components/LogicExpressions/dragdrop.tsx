import { DataContext } from "@xgovformbuilder/designer/client/context";
import { LogicExpressionTypes } from "@xgovformbuilder/model";
import React, { useContext, useState } from "react";

import TestingRefactor from "./testing-refactor";

interface Props {
  expression: string;
  expressionType: LogicExpressionTypes;
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

function initialInputActions(expressionType: string): actionType[] {
  // const { data, save } = useContext(DataContext);
  // const logicExpressions = data?.logicExpressions;

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
  } else {
    return [
      { label: "text", color: "grey" },
      { label: "[variable]", color: "teal" },
      { label: "⮐", color: "red" },
    ] as actionType[];
  }
}

function DragDrop({ expressionType }: Props) {
  const [inputActions, setInputActions] = useState<actionType[]>(
    initialInputActions(expressionType)
  );

  return <TestingRefactor inputActions={inputActions} />;
}

export default DragDrop;
