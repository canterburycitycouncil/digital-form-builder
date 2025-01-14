import { DataContext } from "@xgovformbuilder/designer/client/context";
import { useListItem } from "@xgovformbuilder/designer/client/hooks/list/useListItem";
import { i18n, withI18n } from "@xgovformbuilder/designer/client/i18n";
import { clone, FormDefinition } from "@xgovformbuilder/model";
import React, { useContext } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

import {
  ListsEditorContext,
  ListsEditorStateActions,
} from "./reducers/list/listsEditorReducer";
import { ListActions } from "./reducers/listActions";
import { ListContext } from "./reducers/listReducer";

const DragHandle = SortableHandle(() => (
  <span className="drag-handle-list">&#9776;</span>
));

const SortableItem = SortableElement(({ item, removeItem, selectListItem }) => {
  return (
    <tr className="govuk-table__row">
      <td className="govuk-table__cell" width="20px">
        <DragHandle />
      </td>
      <td className="govuk-table__cell">{item.text ?? item.label}</td>
      <td className="govuk-table__cell" width="50px">
        <a
          href="#"
          onClick={(e) => {
            e?.preventDefault();
            selectListItem(item);
          }}
        >
          Edit
        </a>
      </td>
      <td className="govuk-table__cell" width="50px">
        <a
          href="#"
          onClick={(e) => {
            e?.preventDefault();
            removeItem();
          }}
        >
          Delete
        </a>
      </td>
    </tr>
  );
});

const SortableList = SortableContainer(
  ({ items, selectListItem, removeItem }) => {
    return (
      <tbody className="govuk-table__body">
        {items.map((item, idx) => (
          <SortableItem
            key={`item-${idx}`}
            item={item}
            index={idx}
            selectListItem={selectListItem}
            removeItem={() => removeItem(idx)}
          />
        ))}
      </tbody>
    );
  }
);

function ListItems() {
  const { state: listEditorState, dispatch: listsEditorDispatch } = useContext(
    ListsEditorContext
  );
  const { isEditingStatic } = listEditorState;
  const { data, save } = useContext(DataContext);
  const { state, dispatch } = useContext(ListContext);
  const selectedList = state.selectedList;

  const selectListItem = (payload) => {
    dispatch({ type: ListActions.EDIT_LIST_ITEM, payload });
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST_ITEM, true]);
  };

  const { prepareForDelete } = useListItem(state, dispatch);

  function removeItem(index: number) {
    const copy = clone(data as FormDefinition);
    save(prepareForDelete(copy, index));
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const payload = { oldIndex, newIndex };
    if (!isEditingStatic) {
      dispatch({ type: ListActions.SORT_LIST_ITEM, payload });
    }
  };

  const hasListItems = (selectedList?.items ?? []).length > 0;

  return (
    <div>
      <table className="govuk-table">
        <caption className={"govuk-table__caption"}>
          {i18n("list.items.title")}
          <span className="govuk-hint govuk-!-margin-bottom-0">
            {i18n("list.items.hint")}
          </span>
        </caption>

        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th className="govuk-table__header" scope="col" />
            <th className="govuk-table__header" scope="col" />
            <th className="govuk-table__header" scope="col" />
            <th className="govuk-table__header" scope="col" />
          </tr>
        </thead>

        {!hasListItems && (
          <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <td className="govuk-body">{i18n("list.items.hintNoItems")}</td>
            </tr>
          </tbody>
        )}
        {hasListItems && (
          <SortableList
            items={selectedList?.items ?? []}
            selectListItem={selectListItem}
            removeItem={removeItem}
            onSortEnd={onSortEnd}
            helperClass="dragging-on-modal"
            hideSortableGhost={false}
            lockToContainerEdges
            useDragHandle
          />
        )}
      </table>
    </div>
  );
}

export default withI18n(ListItems);
