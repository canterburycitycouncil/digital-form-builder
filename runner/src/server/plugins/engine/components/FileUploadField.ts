import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import * as helpers from "runner/src/server/plugins/engine/components/helpers";
import { ViewModel } from "runner/src/server/plugins/engine/components/types";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

export class FileUploadField extends FormComponent {
  getFormSchemaKeys() {
    return helpers.getFormSchemaKeys(this.name, "string", this);
  }

  getStateSchemaKeys() {
    return helpers.getStateSchemaKeys(this.name, "string", this);
  }

  get attributes() {
    return {
      accept: "image/jpeg,image/gif,image/png,application/pdf",
    };
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const { options } = this;
    const viewModel: ViewModel = {
      ...super.getViewModel(formData, errors),
      attributes: this.attributes,
    };

    if ("multiple" in options && options.multiple) {
      viewModel.attributes.multiple = "multiple";
    }

    return viewModel;
  }

  get dataType() {
    return "file";
  }
}
