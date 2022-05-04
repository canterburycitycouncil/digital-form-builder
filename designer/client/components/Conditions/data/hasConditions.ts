import { FormDefinition } from "@xgovformbuilder/model/src";

export function hasConditions(data: FormDefinition): boolean {
  return data.conditions.length > 0;
}
