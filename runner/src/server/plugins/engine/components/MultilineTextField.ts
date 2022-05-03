import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import * as helpers from "runner/src/server/plugins/engine/components/helpers";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

export class MultilineTextField extends FormComponent {
  getFormSchemaKeys() {
    return helpers.getFormSchemaKeys(this.name, "string", this);
  }

  getStateSchemaKeys() {
    return helpers.getStateSchemaKeys(this.name, "string", this);
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const schema = this.schema;
    const options = this.options;
    const viewModel = super.getViewModel(formData, errors);

    if ("max" in schema && schema.max) {
      viewModel.attributes = {
        maxlength: schema.max,
      };
    }

    if ("rows" in options && options.rows) {
      viewModel.rows = options.rows;
    }

    return viewModel;
  }
}
