import { customAlphabet } from "nanoid";

/**
 * Custom alphabet is required because a number of formats of ID are invalid property names
 * and expr-eval (condition logic) will fail to execute.
 */
export const randomId = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

interface CurrentFormInterface {
  options?: {
    [key: string]: any;
  };
  schema?: {
    [key: string]: any;
  };
}

export function getFormData(form) {
  const formData = new window.FormData(form);
  const currentForm: CurrentFormInterface = {
    options: {},
    schema: {},
  };

  function cast(name, val) {
    const el = form.elements[name];
    const cast = el && el.currentFormset.cast;

    if (!val) {
      return undefined;
    }

    if (cast === "number") {
      return Number(val);
    } else if (cast === "boolean") {
      return val === "on";
    }
    if (val === "true" || val === "false") {
      return Boolean(val);
    }
    return val;
  }

  formData.forEach((value, key) => {
    const optionsPrefix = "options.";
    const schemaPrefix = "schema.";

    if (typeof value === "string") {
      value = value.trim();
    }

    if (value) {
      if (key.startsWith(optionsPrefix) && currentForm.options) {
        if (key === `${optionsPrefix}required` && value === "on") {
          currentForm.options.required = false;
        } else if (key === `${optionsPrefix}optionalText` && value === "on") {
          currentForm.options.optionalText = false;
        } else {
          currentForm.options[key.substr(optionsPrefix.length)] = cast(
            key,
            value
          );
        }
      } else if (key.startsWith(schemaPrefix) && currentForm.schema) {
        currentForm.schema[key.substr(schemaPrefix.length)] = cast(key, value);
      } else if (value) {
        currentForm[key] = value;
      }
    }
  });

  // Cleanup
  if (currentForm.schema && !Object.keys(currentForm.schema).length)
    delete currentForm.schema;
  if (currentForm.options && !Object.keys(currentForm.options).length)
    delete currentForm.options;

  return currentForm;
}

export function toUrl(title) {
  return `/${(title?.replace(/[^a-zA-Z0-9- ]/g, "") ?? "")
    .trim()
    .replace(/ +/g, "-")
    .toLowerCase()}`;
}

export function camelCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s-_]+(.)/g, (_m, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function isEmpty(str = "") {
  return `${str}`.trim().length < 1;
}

export function arrayMove(arr, from, to) {
  const elm = arr.splice(from, 1)[0];
  arr.splice(to, 0, elm);
  return arr;
}

export function formatForm(freshForm, currentForm) {
  const newFormItemNames = Object.getOwnPropertyNames(freshForm);
  newFormItemNames?.forEach((item) => {
    if (!currentForm?.hasOwnProperty(item)) {
      currentForm[item] = freshForm[item];
    }
  });
  const currentFormItems = Object.getOwnPropertyNames(currentForm);
  currentFormItems?.forEach((item) => {
    if (!freshForm?.hasOwnProperty(item)) {
      delete currentForm[item];
    }
  });
  return currentForm;
}
