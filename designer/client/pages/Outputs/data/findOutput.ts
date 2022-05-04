import { FormDefinition } from "@xgovformbuilder/model/src";

import { Output } from "../outputs/types";
import { Found } from "./types";

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
        previous: output.previous === oldName ? newName : output.previous,
        previousValues: output.previousValues,
        next:
          output.next?.map((link) => (link === oldName ? newName : link)) ?? [],
      })
    ),
  };
}
