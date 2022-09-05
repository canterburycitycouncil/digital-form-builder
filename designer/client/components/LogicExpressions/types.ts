import { FormDefinition, LogicExpression, Page } from "@xgovformbuilder/model";

export interface LogicExpressionProps {
  data: FormDefinition;
  logicExpression: LogicExpression;
  logicExpressionIndex: number;
  save: Function;
  onEdit: Function;
  onCancel: Function;
}

export const formVariables = [
  "id",
  "internalOnly",
  "startPage",
  "version",
  "createdAt",
  "updatedAt",
];

export const getLogicVariables = (
  logicExpressions: LogicExpression[]
): string[] => {
  return logicExpressions.map((expression) => expression.variableName);
};

export const getComponentVariables = (pages: Page[]): string[] => {
  return pages.reduce<string[]>((acc, page) => {
    if (page.components && page.components.length > 0) {
      acc.concat(page.components.map((component) => component.name));
    }
    return acc;
  }, []);
};
