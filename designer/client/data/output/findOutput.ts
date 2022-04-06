import { FormDefinition } from "@xgovformbuilder/model";
import { Found } from "..";
import { Output } from "../../outputs-visualiser/outputs/types";

/**
 * @returns returns a tuple of [Page, number]
 */
export function findOutput(data: FormDefinition, name: string): Found<Output> {
  const index = data.outputs.findIndex((output) => output?.name === name);
  if (index < 0) {
    throw Error(`no name found with the name ${name}`);
  }
  return [{ ...data.outputs[index] }, index];
}

export function updateLinksTo(
  data: FormDefinition,
  oldName: string,
  newName: string
): FormDefinition {
  return {
    ...data,
    outputs: data.outputs.map(
      (output): Output => ({
        ...output,
        name: output.name === oldName ? newName : output.name,
        previous:
          output.previous?.map((link) => (link === oldName ? newName : link)) ??
          [],
        next:
          output.next?.map((link) => (link === oldName ? newName : link)) ?? [],
      })
    ),
  };
}
