import { FormDefinition, Page } from "@xgovformbuilder/model/src";

import { Path } from "./types";

export function updateLinksTo(
  data: FormDefinition,
  oldPath: Path,
  newPath: Path
): FormDefinition {
  return {
    ...data,
    pages: data.pages.map(
      (page): Page => ({
        ...page,
        path: page.path === oldPath ? newPath : page.path,
        next:
          page.next?.map((link) => ({
            ...link,
            path: link.path === oldPath ? newPath : link.path,
          })) ?? [],
      })
    ),
  };
}
