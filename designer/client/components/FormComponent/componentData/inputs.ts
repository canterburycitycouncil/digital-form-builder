import { FormDefinition } from "@xgovformbuilder/model";

import { allPathsLeadingTo } from "../../Page/data";
import { Input, isNotContentType, Path } from "../componentData/types";

export function allInputs(data: FormDefinition): Input[] {
  const { pages = [] } = data;
  return pages.flatMap((page) => {
    const inputs = (page.components ?? []).filter(isNotContentType);
    return inputs.map((input) => {
      return {
        name: input.name,
        page: { path: page.path, section: page.section },
        propertyPath: !!page.section
          ? `${page.section}.${input.name}`
          : input.name,
        title: input.title,
        list: "list" in input ? input.list : undefined,
        type: input.type,
      };
    });
  });
}

export function inputsAccessibleAt(data: FormDefinition, path: Path) {
  const pages = allPathsLeadingTo(data, path);
  return allInputs({
    ...data,
    pages: data.pages.filter((page) => pages.includes(page.path)),
  });
}
