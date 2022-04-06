import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";
import { ComponentBase } from "runner/src/server/plugins/engine/components/ComponentBase";

export class Html extends ComponentBase {
  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const { options } = this;
    const viewModel = {
      ...super.getViewModel(formData, errors),
      content: this.content,
    };

    if ("condition" in options && options.condition) {
      viewModel.condition = options.condition;
    }

    return viewModel;
  }
}
