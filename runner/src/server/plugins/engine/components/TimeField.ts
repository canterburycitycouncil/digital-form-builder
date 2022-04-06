import * as helpers from "runner/src/server/plugins/engine/components/helpers";
import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import { FormModel } from "runner/src/server/plugins/engine/models";
import { addClassOptionIfNone } from "runner/src/server/plugins/engine/components/helpers";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

import { InputFieldsComponentsDef } from "@xgovformbuilder/components";

export class TimeField extends FormComponent {
  constructor(def: InputFieldsComponentsDef, model: FormModel) {
    super(def, model);
    addClassOptionIfNone(this.options, "govuk-input--width-4");
  }

  getFormSchemaKeys() {
    return helpers.getFormSchemaKeys(this.name, "string", this);
  }

  getStateSchemaKeys() {
    return helpers.getStateSchemaKeys(this.name, "string", this);
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const viewModel = {
      ...super.getViewModel(formData, errors),
      type: "time",
    };

    return viewModel;
  }
}
