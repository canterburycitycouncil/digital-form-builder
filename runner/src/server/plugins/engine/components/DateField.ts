import { InputFieldsComponentsDef } from "@xgovformbuilder/data-model";
import moment from "moment";
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
  FormSubmissionState,
} from "runner/src/server/plugins/engine/types";

export class DateField extends FormComponent {
  constructor(def: InputFieldsComponentsDef, model: FormModel) {
    super(def, model);
    addClassOptionIfNone(this.options, "govuk-input--width-10");
  }

  getFormSchemaKeys() {
    return getFormSchemaKeys(this.name, "date", this);
  }

  getStateSchemaKeys() {
    return getStateSchemaKeys(this.name, "date", this);
  }

  getFormValueFromState(state: FormSubmissionState) {
    const name = this.name;
    const value = state[name];
    return value ? moment(value).format("YYYY-MM-DD") : value;
  }

  getDisplayStringFromState(state: FormSubmissionState) {
    const name = this.name;
    const value = state[name];
    return value ? moment(value).format("D MMMM YYYY") : "";
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    return {
      ...super.getViewModel(formData, errors),
      type: "date",
    };
  }

  get dataType() {
    return "date";
  }
}
