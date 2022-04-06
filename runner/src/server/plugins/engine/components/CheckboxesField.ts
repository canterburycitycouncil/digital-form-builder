import {
  FormData,
  FormSubmissionErrors,
  FormSubmissionState,
} from "runner/src/server/plugins/engine/types";
import { FormModel } from "runner/src/server/plugins/engine/models";
import { SelectionControlField } from "runner/src/server/plugins/engine/components/SelectionControlField";

import { ListComponentsDef } from "@xgovformbuilder/components";

import joi from "joi";

export class CheckboxesField extends SelectionControlField {
  constructor(def: ListComponentsDef, model: FormModel) {
    super(def, model);

    let schema = joi
      .array()
      .items(joi[this.listType]().allow(...this.values))
      .single()
      .label(def.title);

    if (def.options.required !== false) {
      schema = schema.required();
    }

    this.formSchema = schema;
    this.stateSchema = schema;
  }

  getDisplayStringFromState(state: FormSubmissionState) {
    return state?.[this.name]?.join(", ");
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const viewModel = super.getViewModel(formData, errors);
    let formDataItems = (formData[this.name] ?? "").split(",");
    viewModel.items = (viewModel.items ?? []).map((item) => ({
      ...item,
      checked: !!formDataItems.find((i) => `${item.value}` === i),
    }));

    return viewModel;
  }
}
