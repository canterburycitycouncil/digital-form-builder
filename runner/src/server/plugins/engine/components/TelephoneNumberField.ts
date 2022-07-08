import { TelephoneNumberFieldComponent } from "@xgovformbuilder/model";
import joi, { Schema } from "joi";
import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import { addClassOptionIfNone } from "runner/src/server/plugins/engine/components/helpers";
import { FormModel } from "runner/src/server/plugins/engine/models";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

const PATTERN = /^[0-9\\\s+()-]*$/;
const DEFAULT_MESSAGE = "Enter a telephone number in the correct format";
export class TelephoneNumberField extends FormComponent {
  constructor(def: TelephoneNumberFieldComponent, model: FormModel) {
    super(def, model);

    const { options = {}, schema = {} } = def;
    const pattern = schema.regex ? new RegExp(schema.regex) : PATTERN;
    let componentSchema = joi
      .string()
      .pattern(pattern)
      .rule({
        message: def.options?.customValidation ?? DEFAULT_MESSAGE,
      })
      .label(def.title);

    if (options.required !== false) {
      componentSchema = componentSchema.required();
    } else {
      componentSchema = componentSchema.allow("");
    }

    if (schema.max) {
      componentSchema = componentSchema.max(schema.max);
    }

    if (schema.min) {
      componentSchema = componentSchema.min(schema.min);
    }

    this.schema = componentSchema;

    addClassOptionIfNone(this.options, "govuk-input--width-10");
  }

  getFormSchemaKeys() {
    return { [this.name]: this.schema as Schema };
  }

  getStateSchemaKeys() {
    return { [this.name]: this.schema as Schema };
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const schema: any = this.schema;
    const viewModel = {
      ...super.getViewModel(formData, errors),
      type: "tel",
    };

    if (schema.max) {
      viewModel.attributes = {
        maxlength: schema.max,
      };
    }

    return viewModel;
  }
}
