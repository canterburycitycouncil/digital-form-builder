import { ComponentDef, ComponentTypes } from "@xgovformbuilder/model";
import sortBy from "lodash/sortBy";
import React, { MouseEvent, useCallback } from "react";

import { i18n } from "../../../i18n";
import { CreateListItem } from "./CreateListItem";

const SelectionFieldsTypes = [
  "CheckboxesField",
  "RadiosField",
  "SelectField",
  "YesNoField",
];

const contentFields: ComponentDef[] = [];
const selectionFields: ComponentDef[] = [];
const inputFields: ComponentDef[] = [];

sortBy(ComponentTypes, ["type"]).forEach((component) => {
  if (component.subType === "content") {
    contentFields.push(component);
  } else if (SelectionFieldsTypes.indexOf(component.type) > -1) {
    selectionFields.push(component);
  } else {
    inputFields.push(component);
  }
});

type Props = {
  onSelectComponent: (type: ComponentDef) => void;
};

export const ComponentCreateList = ({ onSelectComponent }: Props) => {
  const selectComponent = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, component: ComponentDef) => {
      event.preventDefault();
      onSelectComponent(component);
    },
    [onSelectComponent]
  );

  const fieldTypesMap = [
    {
      key: "contentFields",
      fields: contentFields,
      heading: "content",
      hint: "component.contentfields_info",
    },
    {
      key: "selectionFields",
      fields: selectionFields,
      heading: "Selection fields",
      hint: "component.selectfields_info",
    },
    {
      key: "inputFields",
      fields: inputFields,
      heading: "Input fields",
      hint: "component.inputfields_info",
    },
  ];

  return (
    <div
      className="govuk-form-group component-create__list"
      data-testid="component-create-list"
    >
      <h1 className="govuk-hint">{i18n("component.create_info")}</h1>
      <ol className="govuk-list">
        {fieldTypesMap.map((fieldType) => (
          <CreateListItem
            key={fieldType.key}
            fields={fieldType.fields}
            heading={fieldType.heading}
            hint={fieldType.hint}
            onSelectComponent={selectComponent}
          />
        ))}
      </ol>
    </div>
  );
};
