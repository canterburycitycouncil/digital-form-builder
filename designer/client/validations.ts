import { ValidationError } from "./components/FormComponent/componentReducer/componentReducer.validations";
import { isEmpty } from "./helpers";
import { I18n, i18n } from "./i18n";

export function hasValidationErrors(errors: ValidationError[] = []) {
  return errors.length > 0;
}

export function validateNotEmpty(
  id: string,
  fieldName: string,
  value: string,
  existingErrors: ValidationError[] = []
) {
  const hasErrors = isEmpty(value);
  const errors = existingErrors;

  if (hasErrors) {
    errors.push({
      href: `#${id}`,
      children: i18n("errors.field", { field: fieldName }),
    });
  }
  return errors;
}

export function validateName(
  id: string,
  fieldName: string,
  value: string,
  i18nProp?: any
) {
  const translate = i18nProp ?? i18n;
  const namesIsEmpty = isEmpty(value);
  const nameHasErrors = /\s/g.test(value);
  const errors: ValidationError[] = [];
  if (nameHasErrors) {
    const message = translate
      ? translate("name.errors.whitespace")
      : "Name must not contain spaces";
    errors.push({
      href: `#${id}`,
      children: message,
    });
  } else if (namesIsEmpty) {
    const message = translate
      ? translate("errors.field", { field: fieldName })
      : "Enter Name";
    errors.push({
      href: `#${id}`,
      children: message,
    });
  }
  return errors;
}

export function validateTitle(id: string, value: string, i18nProp?: any) {
  const translate: I18n = i18nProp ?? i18n;
  const titleHasErrors = isEmpty(value);
  const errors: ValidationError[] = [];
  if (titleHasErrors) {
    const message = translate
      ? translate("errors.field", { field: "$t(title)" })
      : "Enter title";

    errors.push({
      href: `#${id}`,
      children: message,
    });
  }
  return errors;
}

export function validateRegex(
  id: string,
  fieldName: string,
  value: string,
  regExp: RegExp,
  existingErrors: ValidationError[] = []
) {
  const isValid = value.match(regExp);
  const errors = existingErrors;

  if (!isValid) {
    errors.push({
      href: `#${id}`,
      children: i18n("errors.regex", { field: fieldName }),
    });
  }
  return errors;
}
