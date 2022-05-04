import { DataContext } from "@xgovformbuilder/designer/client/context";
import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { hasValidationErrors } from "@xgovformbuilder/designer/client/validations";
import {
  ComponentTypeEnum as Types,
  FormDefinition,
} from "@xgovformbuilder/model/src";
import React, { memo, useContext, useLayoutEffect } from "react";

import { updateComponent } from "./componentData";
import { ComponentContext } from "./componentReducer/componentReducer";
import { Actions } from "./componentReducer/types";
import ComponentTypeEdit from "./ComponentTypeEdit";

const LIST_TYPES = [
  Types.AutocompleteField,
  Types.List,
  Types.RadiosField,
  Types.SelectField,
  Types.YesNoField,
  Types.FlashCard,
];

export function ComponentEdit(props) {
  const { data, save } = useContext(DataContext);
  const { state, dispatch } = useContext(ComponentContext);
  const {
    selectedComponent,
    initialName,
    errors = {},
    hasValidated,
    selectedListName,
  } = state;
  const { page, toggleShowEditor } = props;
  const hasErrors = hasValidationErrors(errors);
  const componentToSubmit = { ...selectedComponent };

  useLayoutEffect(() => {
    if (hasValidated && !hasErrors) {
      handleSubmit(null);
    }
  }, [hasValidated]);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!hasValidated) {
      dispatch({ type: Actions.VALIDATE });
      return;
    }

    if (hasErrors) {
      return;
    }

    if (LIST_TYPES.includes(selectedComponent.type)) {
      if (selectedListName !== "static") {
        componentToSubmit.values = {
          type: "listRef",
          list: selectedListName,
        };
        delete componentToSubmit.items;
      } else {
        componentToSubmit.values.valueType = "static";
      }
    }

    const updatedData = updateComponent(
      data,
      page.path,
      initialName,
      componentToSubmit
    );
    await save(updatedData);
    toggleShowEditor();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const copy = { ...(data as FormDefinition) };
    const indexOfPage = copy.pages.findIndex((p) => p.path === page.path);
    const indexOfComponent = copy.pages[indexOfPage].components?.findIndex(
      (component) => component.name === selectedComponent.initialName
    );
    copy.pages[indexOfPage].components?.splice(indexOfComponent, 1);
    await save(copy);
    toggleShowEditor();
  };

  return (
    <>
      {hasErrors && <ErrorSummary errorList={Object.values(errors)} />}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <ComponentTypeEdit page={page} />
        <button className="govuk-button" type="submit">
          Save
        </button>{" "}
        <a href="#" onClick={handleDelete} className="govuk-link">
          Delete
        </a>
      </form>
    </>
  );
}

export default memo(ComponentEdit);
