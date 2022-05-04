import { ComponentBase } from "runner/src/server/plugins/engine/components/ComponentBase";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

export class Para extends ComponentBase {
  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const options: any = this.options;
    const viewModel = {
      ...super.getViewModel(formData, errors),
      content: this.content,
    };

    if (options.condition) {
      viewModel.condition = options.condition;
    }
    return viewModel;
  }
}
