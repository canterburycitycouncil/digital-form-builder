import { ListComponentsDef } from "@xgovformbuilder/model";
import { Item, List } from "@xgovformbuilder/model";
import joi, { Schema } from "joi";
import { FormComponent } from "runner/src/server/plugins/engine/components/FormComponent";
import { ListItem } from "runner/src/server/plugins/engine/components/types";
import { FormModel } from "runner/src/server/plugins/engine/models";
import {
  FormData,
  FormSubmissionErrors,
  FormSubmissionState,
} from "runner/src/server/plugins/engine/types";

export class ListFormComponent extends FormComponent {
  list: List;
  listType = "string";
  formSchema;
  stateSchema;
  options: ListComponentsDef["options"];

  get items(): Item[] {
    return this.list?.items ?? [];
  }
  get values(): (string | number | boolean)[] {
    return this.items?.map((item) => item.value) ?? [];
  }

  constructor(def: ListComponentsDef, model: FormModel) {
    super(def, model);
    // @ts-ignore
    this.list = model.getList(def.list);
    this.listType = this.list.type ?? "string";
    this.options = def.options;

    /**
     * Only allow a user to answer with values that have been defined in the list
     */
    let schema = joi[this.listType]()
      .allow(...this.values)
      .label(def.title);

    if (def.options.required !== false) {
      schema = schema.required();
    }

    this.formSchema = schema;
    this.stateSchema = schema;
  }

  getFormSchemaKeys() {
    return { [this.name]: this.formSchema as Schema };
  }

  getStateSchemaKeys() {
    return { [this.name]: this.stateSchema as Schema };
  }

  getDisplayStringFromState(state: FormSubmissionState): string | string[] {
    const { name, items } = this;
    const value = state[name];
    const item = items.find((item) => String(item.value) === String(value));
    return `${item?.value ?? ""}`;
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const { name, items } = this;
    const viewModel = super.getViewModel(formData, errors);

    const viewModelItems: ListItem[] =
      items.map(({ text, value, description = "", condition }) => ({
        text: this.localisedString(text),
        value,
        description,
        selected: `${value}` === `${formData[name]}`,
        condition,
      })) ?? [];

    viewModel.items = viewModelItems;

    return viewModel;
  }
}
