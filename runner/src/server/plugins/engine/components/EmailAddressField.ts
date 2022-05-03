import { InputFieldsComponentsDef } from "@xgovformbuilder/data-model";
import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import {
  addClassOptionIfNone,
  getFormSchemaKeys,
  getStateSchemaKeys,
} from "runner/src/server/plugins/engine/components/helpers";
import { FormModel } from "runner/src/server/plugins/engine/models";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

export class EmailAddressField extends FormComponent {
  constructor(def: InputFieldsComponentsDef, model: FormModel) {
    super(def, model);
    this.schema["email"] = true;
    addClassOptionIfNone(this.options, "govuk-input--width-20");
  }

  getFormSchemaKeys() {
    return getFormSchemaKeys(this.name, "string", this);
  }

  getStateSchemaKeys() {
    return getStateSchemaKeys(this.name, "string", this);
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const schema = this.schema;
    const viewModel = super.getViewModel(formData, errors);

    if ("max" in schema && schema.max) {
      viewModel.attributes = {
        maxlength: schema.max,
      };
    }

    viewModel.type = "email";

    return viewModel;
  }
}
