import { FormDefinition, LogicExpression } from "@xgovformbuilder/data-model";

export interface LogicExpressionProps {
  data: FormDefinition;
  logicExpression: LogicExpression;
  save: Function;
  onEdit: Function;
  onCancel: Function;
}
