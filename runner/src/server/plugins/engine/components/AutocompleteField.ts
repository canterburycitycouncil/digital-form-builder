import { ListComponentsDef } from "@xgovformbuilder/components";

import { SelectField } from "runner/src/server/plugins/engine/components/SelectField";
import { FormModel } from "runner/src/server/plugins/engine/models";
import { addClassOptionIfNone } from "runner/src/server/plugins/engine/components/helpers";

export class AutocompleteField extends SelectField {
  constructor(def: ListComponentsDef, model: FormModel) {
    super(def, model);
    addClassOptionIfNone(this.options, "govuk-input--width-20");
  }
}
