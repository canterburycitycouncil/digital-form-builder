import { FormDefinition } from "@xgovformbuilder/data-model";

export function hasConditions(data: FormDefinition): boolean {
  return data.conditions.length > 0;
}
