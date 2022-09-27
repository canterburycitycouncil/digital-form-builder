import { LogicExpressionTypes } from "@xgovformbuilder/model";
import React, { FC, useState } from "react";

import { Flyout } from "../Flyout";
import { RenderInPortal } from "../RenderInPortal";
import Testing from "./testing";

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

const initialInputActions = (expressionType: string): actionType[] => {
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
};

export const DragDrop: FC<Props> = ({ expressionType }) => {
  const [inputActions, setInputActions] = useState<actionType[]>(
    initialInputActions(expressionType)
  );

  return <Testing inputActions={inputActions} />;
};
