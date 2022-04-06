import { ListFormComponent } from "runner/src/server/plugins/engine/components/ListFormComponent";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

import { SelectFieldComponent } from "@xgovformbuilder/components";

export class SelectField extends ListFormComponent {
  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const options: SelectFieldComponent["options"] = this.options;
    const viewModel = super.getViewModel(formData, errors);

    viewModel.items = [{ value: "" }, ...(viewModel.items ?? [])];
    if (options.autocomplete) {
      viewModel.attributes.autocomplete = options.autocomplete;
    }
    return viewModel;
  }
}
