import {
  FormData,
  FormSubmissionErrors,
  FormSubmissionState,
} from "runner/src/server/plugins/engine/types";
import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import {
  getFormSchemaKeys,
  getStateSchemaKeys,
} from "runner/src/server/plugins/engine/components/helpers";

export class NumberField extends FormComponent {
  getFormSchemaKeys() {
    return getFormSchemaKeys(this.name, "number", this);
  }

  getStateSchemaKeys() {
    return getStateSchemaKeys(this.name, "number", this);
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const schema: any = this.schema;
    const viewModel = {
      ...super.getViewModel(formData, errors),
      type: "number",
    };

    if (schema.precision) {
      viewModel.attributes.step = "0." + "1".padStart(schema.precision, "0");
    }

    return viewModel;
  }

  getDisplayStringFromState(state: FormSubmissionState) {
    return state[this.name] || state[this.name] === 0
      ? state[this.name].toString()
      : undefined;
  }
}
