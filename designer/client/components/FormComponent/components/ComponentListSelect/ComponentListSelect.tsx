import { ComponentContext } from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/componentReducer";
import { Actions as ComponentActions } from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/types";
import { findList } from "@xgovformbuilder/designer/client/components/List/data";
import {
  ListsEditorContext,
  ListsEditorStateActions,
} from "@xgovformbuilder/designer/client/components/List/reducers/list/listsEditorReducer";
import { ListActions } from "@xgovformbuilder/designer/client/components/List/reducers/listActions";
import { ListContext } from "@xgovformbuilder/designer/client/components/List/reducers/listReducer";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { ListComponentsDef } from "@xgovformbuilder/model/src";
import classNames from "classnames";
import { Label } from "govuk-react-jsx";
import React, { useContext, useEffect, useState } from "react";
export function ComponentListSelect() {
  const { data } = useContext(DataContext);
  const { state: listsEditorState, dispatch: listsEditorDispatch } = useContext(
    ListsEditorContext
  );

  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent, errors = {} } = state;
  const { list } = selectedComponent as ListComponentsDef;

  const { state: listState, dispatch: listDispatch } = useContext(ListContext);
  const { selectedList } = listState;

  const [selectedListTitle, setSelectedListTitle] = useState(
    selectedList?.title
  );

  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (selectedList?.isNew) {
      return;
    }
    try {
      const [foundList] = findList(data, list);
      listDispatch({
        type: ListActions.SET_SELECTED_LIST,
        payload: foundList,
      });
    } catch (e) {
      logger.error("ComponentListSelect", e);
    }
  }, [data.lists, list]);

  useEffect(() => {
    setSelectedListTitle(selectedList?.title ?? selectedList?.name);
  }, [selectedList]);

  useEffect(() => {
    if (!listsEditorState.isEditingList && isAddingNew) {
      dispatch({
        type: ComponentActions.SET_SELECTED_LIST,
        payload: selectedList.name,
      });
      setIsAddingNew(false);
    }
  }, [listsEditorState.isEditingList, selectedList?.name, isAddingNew]);

  const editList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: ComponentActions.SET_SELECTED_LIST,
      payload: e.target.value,
    });
  };

  const handleEditListClick = (e: React.MouseEvent) => {
    e.preventDefault();
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true]);
  };

  const handleAddListClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingNew(true);
    listDispatch({ type: ListActions.ADD_NEW_LIST });
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true]);
  };

  return (
    <>
      <div
        className={classNames({
          "govuk-form-group": true,
          "govuk-form-group--error": errors,
        })}
      >
        <Label htmlFor="field-options-list" className="govuk-label--s">
          {i18n("list.select.title")}
        </Label>
        <span className="govuk-hint">{i18n("list.select.helpText")}</span>
        <select
          className="govuk-select govuk-input--width-10"
          id="field-options-list"
          name="options.list"
          value={list}
          onChange={editList}
        >
          <option value="-1">{i18n("list.select.option")}</option>
          {data.lists.map(
            (
              list: {
                name: string | number | readonly string[] | undefined;
                title: React.ReactNode;
              },
              index: number
            ) => {
              return (
                <option key={`${list.name}-${index}`} value={list.name}>
                  {list.title}
                </option>
              );
            }
          )}
        </select>
        <div className="govuk-form-group">
          {selectedListTitle && (
            <button
              className="govuk-link govuk-body govuk-!-margin-bottom-0"
              onClick={handleEditListClick}
            >
              {i18n("list.edit", { title: selectedListTitle })}
            </button>
          )}
          <button
            className="govuk-link govuk-body govuk-!-margin-bottom-0"
            data-testid="add-list"
            onClick={handleAddListClick}
          >
            {i18n("list.addNew")}
          </button>
        </div>
      </div>
    </>
  );
}

export default ComponentListSelect;
