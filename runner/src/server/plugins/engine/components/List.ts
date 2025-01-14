import { Item } from "@xgovformbuilder/model";
import { ComponentBase } from "runner/src/server/plugins/engine/components/ComponentBase";
import {
  FormData,
  FormSubmissionErrors,
} from "runner/src/server/plugins/engine/types";

export class List extends ComponentBase {
  list: List;
  get items(): Item[] {
    return this.list?.items ?? [];
  }

  constructor(def, model) {
    super(def, model);
    this.list = model.getList(def.list);
  }

  getViewModel(formData: FormData, errors: FormSubmissionErrors) {
    const { items, options } = this;
    const viewModel = super.getViewModel(formData, errors);

    if ("type" in options && options.type) {
      viewModel.type = options.type;
    }

    viewModel.content = items.map((item) => {
      const contentItem: { text: string; condition?: any } = {
        text: item.text,
      };
      if (item.condition) {
        contentItem.condition = item.condition;
      }
      return contentItem;
    });

    return viewModel;
  }
}
