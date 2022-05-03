import "./ComponentCreate.scss";

import { BackLink } from "designer/client/components/BackLink";
import { ComponentCreateList } from "designer/client/components/ComponentCreate/ComponentCreateList";
import { useComponentCreate } from "designer/client/components/ComponentCreate/useComponentCreate";
import ComponentTypeEdit from "designer/client/ComponentTypeEdit";
import { ErrorSummary } from "designer/client/error-summary";
import { i18n } from "designer/client/i18n";
import React from "react";

export function ComponentCreate(props) {
  const {
    handleSubmit,
    handleTypeChange,
    reset,
    hasErrors,
    errors,
    component,
    isSaving,
    renderTypeEdit,
  } = useComponentCreate(props);

  const type = component?.type;

  return (
    <div className="component-create">
      {!type && <h4 className="govuk-heading-m">{i18n("component.create")}</h4>}
      {type && (
        <>
          <BackLink onClick={reset}>
            {i18n("Back to create component list")}
          </BackLink>
          <h4 className="govuk-heading-m">
            {i18n(`fieldTypeToName.${component?.["type"]}`)}{" "}
            {i18n("component.component")}
          </h4>
        </>
      )}
      {hasErrors && <ErrorSummary errorList={errors} />}
      {!type && <ComponentCreateList onSelectComponent={handleTypeChange} />}
      {type && renderTypeEdit && (
        <form onSubmit={handleSubmit}>
          {type && <ComponentTypeEdit />}
          <button type="submit" className="govuk-button" disabled={isSaving}>
            Save
          </button>
        </form>
      )}
    </div>
  );
}

export default ComponentCreate;
