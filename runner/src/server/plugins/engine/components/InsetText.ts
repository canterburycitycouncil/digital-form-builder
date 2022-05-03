import { ComponentBase } from "runner/src/server/plugins/engine/components/ComponentBase";
import { ViewModel } from "runner/src/server/plugins/engine/components/types";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

export class InsetText extends ComponentBase {
  getViewModel(formData: FormData, errors: FormSubmissionErrors): ViewModel {
    return {
      ...super.getViewModel(formData, errors),
      content: this.content,
    };
  }
}
