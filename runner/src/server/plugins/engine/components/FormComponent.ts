import { ComponentDef } from "@xgovformbuilder/model";
import joi, { Schema } from "joi";
import { ComponentBase } from "runner/src/server/plugins/engine/components/ComponentBase";
import { optionalText } from "runner/src/server/plugins/engine/components/constants";
import { ViewModel } from "runner/src/server/plugins/engine/components/types";
import { FormModel } from "runner/src/server/plugins/engine/models";
import {
  FormData,
  FormPayload,
  FormSubmissionErrors,
  FormSubmissionState,
} from "runner/src/server/plugins/engine/types";

export class FormComponent extends ComponentBase {
  isFormComponent: boolean = true;
  __lang: string = "en";

  constructor(def: ComponentDef, model: FormModel) {
    super(def, model);

    const schema: any = this.schema;

    schema.error = (errors) => {
      errors.forEach((err) => {
        let limit;
        const today = new Date().setUTCHours(0, 0, 0);

        if (err.context?.limit) {
          limit = err.context.limit.setUTCHours(0, 0, 0);
        }

        const limitIsToday = limit === today;

        switch (err.type) {
          case "any.empty":
          case "any.required":
          case "string.base":
            err.message = `${err.context.label} is required`;
            break;
          case "number.base":
            err.message = `${err.context.label} must be a number`;
            break;
          case "string.email":
            err.message = `${err.context.label} must be a valid email address`;
            break;
          case "string.regex.base":
            err.message = `Enter a valid ${err.context.label.toLowerCase()}`;
            break;
          case "date.min":
            if (limitIsToday) {
              err.message = `${err.context.label} must be in the future`;
            } else {
              err.message = `${
                err.context.label
              } can be no earlier than ${limit.getDate()}/${
                limit.getMonth() + 1
              }/${limit.getFullYear()}`;
            }
            break;
          case "date.max":
            if (limitIsToday) {
              err.message = `${err.context.label} must be in the past`;
            } else {
              err.message = `${
                err.context.label
              } can be no later than ${limit.getDate()}/${
                limit.getMonth() + 1
              }/${limit.getFullYear()}`;
            }
            break;
          default:
            break;
        }
      });
      return errors;
    };
  }

  get lang() {
    return this.__lang;
  }

  set lang(lang) {
    if (lang) {
      this.__lang = lang;
    }
  }

  getFormDataFromState(state: FormSubmissionState) {
    const name = this.name;

    if (name in state) {
      return {
        [name]: this.getFormValueFromState(state),
      };
    }

    return undefined;
  }

  getFormValueFromState(state: FormSubmissionState) {
    const name = this.name;

    if (name in state) {
      return state[name] === null ? "" : state[name].toString();
    }
  }

  getStateFromValidForm(payload: FormPayload) {
    const name = this.name;

    return {
      [name]: this.getStateValueFromValidForm(payload),
    };
  }

  getStateValueFromValidForm(payload: FormPayload): any {
    const name = this.name;

    return name in payload && payload[name] !== "" ? payload[name] : null;
  }

  localisedString(description) {
    let string;
    if (!description) {
      string = "";
    } else if (typeof description === "string") {
      string = description;
    } else {
      string = description?.[this.lang] ?? description.en;
    }
    return string;
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const options: any = this.options;
    const isOptional = options.required === false;
    const optionalPostfix =
      isOptional && options.optionalText !== false ? optionalText : "";
    this.lang = formData.lang as string;
    const label = options.hideTitle
      ? ""
      : `${this.localisedString(this.title)}${optionalPostfix}`;

    const name = this.name;

    const viewModel: ViewModel = {
      ...super.getViewModel(formData, errors),
      label: {
        text: label,
        classes: "govuk-label--s",
      },
      id: name,
      name: name,
      value: formData[name],
    };

    if (this.hint) {
      viewModel.hint = {
        html: this.localisedString(this.hint),
      };
    }

    if (options.classes) {
      viewModel.classes = options.classes;
    }

    if (options.condition) {
      viewModel.condition = options.condition;
    }

    errors?.errorList?.forEach((err) => {
      if (err.name === name) {
        viewModel.errorMessage = {
          text: err.text,
        };
      }
    });

    return viewModel;
  }

  getFormSchemaKeys() {
    return { [this.name]: joi.any() };
  }

  getStateSchemaKeys(): { [k: string]: Schema } {
    return { [this.name]: joi.any() };
  }

  getDisplayStringFromState(state) {
    return state[this.name];
  }

  get dataType() {
    return "text";
  }
}
