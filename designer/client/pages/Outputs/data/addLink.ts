import { FormDefinition } from "@xgovformbuilder/model";

import { findOutput } from "./findOutput";

/**
 * @param data - Data from DataContext
 * @param from - path to link from
 * @param to - path to link to
 * @param condition - condition for path branching
 * @throws Error - if a page has been linked to itself
 */
export function addLink(
  data: FormDefinition,
  from: string,
  to: string
): FormDefinition {
  if (from === to) {
    throw Error("cannot link an output to itself");
  }
  const [fromOutput, index] = findOutput(data, from);
  findOutput(data, to);
  const outputs = [...data.outputs];
  const link: string = to;

  const updatedOutput = {
    ...fromOutput,
    next: [...(fromOutput.next ?? []), link],
  };

  return {
    ...data,
    outputs: outputs.map((output, i) => (i === index ? updatedOutput : output)),
  };
}

export function updateLink(
  data: FormDefinition,
  from: string,
  to: string
): FormDefinition {
  const [fromOutput, fromOutputIndex] = findOutput(data, from);
  const existingLinkIndex =
    fromOutput.next?.findIndex((next) => next === to) ?? -1;
  if (existingLinkIndex < 0) {
    throw Error("Could not find page or links to update");
  }

  const updatedNext = [...fromOutput.next!];
  updatedNext[existingLinkIndex] = updatedNext[existingLinkIndex];
  const updatedOutput = { ...fromOutput, next: updatedNext };

  const outputs = [...data.outputs];
  outputs[fromOutputIndex] = updatedOutput;
  return { ...data, outputs };
}
