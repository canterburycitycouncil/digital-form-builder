import React from "react";
import { i18n } from "../../i18n";
import { ErrorSummary } from "../../error-summary";
import ComponentTypeEdit from "../ComponentTypeEdit";
import { ComponentCreateList } from "./ComponentCreateList";
import { BackLink } from "../../components/BackLink";
import "./ComponentCreate.scss";
import { useComponentCreate } from "./useComponentCreate";

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
