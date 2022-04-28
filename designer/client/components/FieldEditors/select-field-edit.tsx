import { Page } from "@xgovformbuilder/data-model";
import { Autocomplete } from "designer/client/components/Autocomplete";
import ListFieldEdit from "designer/client/components/FieldEditors/list-field-edit";
import { i18n } from "designer/client/i18n";
import React from "react";

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
