import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { Page } from "@xgovformbuilder/model/src";
import React from "react";

import { Autocomplete } from "../components/Autocomplete";
import ListFieldEdit from "../FieldEditors/list-field-edit";

type Props = {
  page: Page;
};

function SelectFieldEdit({ page }: Props) {
  return (
    <ListFieldEdit page={page}>
      <details className="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">
            {i18n("common.detailsLink.title")}
          </span>
        </summary>

        <Autocomplete />
      </details>
    </ListFieldEdit>
  );
}

export default SelectFieldEdit;
