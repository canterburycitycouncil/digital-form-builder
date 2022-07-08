import { FormDefinition } from "@xgovformbuilder/model";
import { ComponentDef } from "@xgovformbuilder/model";

import { findPage } from "../../Page/data";
import { Path } from "../componentData/types";

export function addComponent(
  data: FormDefinition,
  pagePath: Path,
  component: ComponentDef
): FormDefinition {
  const [page, index] = findPage(data, pagePath);

  const { components = [] } = page;
  const updatedPage = { ...page, components: [...components, component] };
  return {
    ...data,
    pages: data.pages.map((page, i) => (index === i ? updatedPage : page)),
  };
}
