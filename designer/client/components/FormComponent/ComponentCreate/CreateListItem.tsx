import { ComponentDef } from "@xgovformbuilder/model";
import React, { MouseEvent } from "react";

import { i18n } from "../../../i18n/i18n";

interface CreateListItemProps {
  heading: string;
  hint: string;
  fields: ComponentDef[];
  onSelectComponent: (
    e: MouseEvent<HTMLAnchorElement>,
    component: ComponentDef
  ) => void;
}

export const CreateListItem = ({
  heading,
  hint,
  fields,
  onSelectComponent,
}: CreateListItemProps) => {
  return (
    <li className="component-create__list__item">
      <h2 className="govuk-heading-s">{i18n(heading)}</h2>
      <div className="govuk-hint">{i18n(hint)}</div>
      <ol className="govuk-list">
        {fields.map((component) => (
          <li key={component.name}>
            <a
              className="govuk-link"
              href="#0"
              onClick={(e) => onSelectComponent(e, component)}
            >
              {i18n(`fieldTypeToName.${component.type}`)}
            </a>
            <div className="govuk-hint">
              {i18n(`fieldTypeToName.${component.type}_info`)}
            </div>
          </li>
        ))}
      </ol>
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
    </li>
  );
};
