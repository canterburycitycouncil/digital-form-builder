import { isEmpty } from "@xgovformbuilder/designer/client/helpers";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { validateTitle } from "@xgovformbuilder/designer/client/validations";
import { ComponentTypeEnum as Types } from "@xgovformbuilder/model";

export interface ValidationError {
  href?: string;
  children: string | [string, Record<string, string>];
}

// TODO move validations to "@xgovformbuilder/designer/client/validations"
const validateName = ({ name }) => {
  //TODO:- should also validate uniqueness.
  const errors: ValidationError[] = [];
  const nameIsEmpty = isEmpty(name);
  const nameHasSpace = /\s/g.test(name);
  if (nameHasSpace) {
    errors.push({
      href: `#field-name`,
      children: "name.errors.whitespace",
    });
  } else if (nameIsEmpty) {
    errors.push({
      href: `#field-name`,
      children: ["errors.field", { field: "Component name" }],
    });
  }

  return errors;
};

const validateContent = ({ content }) => {
  const errors: ValidationError[] = [];
  const contentIsEmpty = isEmpty(content);

  if (contentIsEmpty) {
    errors.push({
      href: `#field-content`,
      children: ["errors.field", { field: "Content" }],
    });
  }

  return errors;
};

const validateList = (component) => {
  const errors: ValidationError[] = [];
  if ((component?.list ?? "-1") === "-1") {
    errors.push({
      href: `#field-options-list`,
      children: "list.errors.select",
    });
  }
  return errors;
};

const ComponentsWithoutTitleField = [Types.InsetText, Types.Html, Types.Para];
const ComponentsWithContentField = [
  Types.InsetText,
  Types.Html,
  Types.Para,
  Types.Details,
];
const ComponentsWithListField = [
  Types.AutocompleteField,
  Types.List,
  Types.RadiosField,
  Types.SelectField,
  Types.CheckboxesField,
];

export function fieldComponentValidations(component) {
  const hasTitle = !ComponentsWithoutTitleField.includes(component.type);
  const hasContentField = ComponentsWithContentField.includes(component.type);
  const hasListField = ComponentsWithListField.includes(component.type);

  const validations = [validateName(component)];

  if (hasTitle) {
    validations.push(validateTitle("field-title", component.title, i18n));
  }

  if (hasContentField) {
    validations.push(validateContent(component));
  }

  if (hasListField) {
    validations.push(validateList(component));
  }

  const errors = validations.reduce((acc, error: ValidationError[]) => {
    console.log(error);
    return !!error ? [...acc, ...error] : acc;
  }, []);

  return errors;
}

export function validateComponent(selectedComponent) {
  return {
    errors: fieldComponentValidations(selectedComponent),
  };
}
