import { FormDefinition, LogicExpression } from "@xgovformbuilder/model/src";

export interface LogicExpressionProps {
  data: FormDefinition;
  logicExpression: LogicExpression;
  save: Function;
  onEdit: Function;
  onCancel: Function;
}
