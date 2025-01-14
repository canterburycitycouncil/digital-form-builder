import {
  ComponentDef,
  ContentComponentsDef,
  InputFieldsComponentsDef,
  ListComponentsDef,
  Page,
} from "@xgovformbuilder/model";

export const isNotContentType = (
  obj: ComponentDef
): obj is InputFieldsComponentsDef | ListComponentsDef => {
  const contentTypes: ContentComponentsDef["type"][] = [
    "Para",
    "Details",
    "Html",
    "InsetText",
  ];
  return !contentTypes.find((type) => `${type}` === `${obj.type}`);
};

export type Input = {
  name: string;
  page: { path: Page["path"]; section: Page["section"] };
  propertyPath: string;
  list: string | undefined;
  title: string;
  type: InputFieldsComponentsDef["type"] | ListComponentsDef["type"];
};

export type Path = Page["path"];
