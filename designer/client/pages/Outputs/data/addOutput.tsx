import { FormDefinition, Output } from "@xgovformbuilder/model/src";

export function addOutput(
  data: FormDefinition,
  output: Output
): FormDefinition {
  const index = data.outputs.findIndex((o) => o.name === output.name);
  if (index > -1) {
    throw Error(`An output with the name ${output.name} already exists`);
  }
  return {
    ...data,
    outputs: [...data.outputs, output],
  };
}
