import { Page } from "@xgovformbuilder/data-model";
import { Flyout } from "designer/client/components/Flyout";
import { RenderInPortal } from "designer/client/components/RenderInPortal";
import { i18n } from "designer/client/i18n";
import ListEdit from "designer/client/list/ListEdit";
import ListItemEdit from "designer/client/list/ListItemEdit";
import ListSelect from "designer/client/list/ListSelect";
import { Warning } from "designer/client/list/Warning";
import {
  ListsEditorContext,
  ListsEditorStateActions,
} from "designer/client/reducers/list/listsEditorReducer";
import { ListContext } from "designer/client/reducers/listReducer";
import React, { useContext } from "react";

type Props = {
  showEditLists: boolean;
  page: Page;
};

const useListsEdit = () => {
  const { state: listEditState, dispatch: listsEditorDispatch } = useContext(
    ListsEditorContext
  );
  const { isEditingList, isEditingListItem, showWarning } = listEditState;
  const { state } = useContext(ListContext);
  const { selectedList, selectedItem } = state;

  const closeFlyout = (action: ListsEditorStateActions) => {
    return () => listsEditorDispatch([action, false]);
  };

  const listTitle = selectedList?.isNew
    ? i18n("list.add")
    : i18n("list.edit", {
        title: state.initialTitle ?? selectedList?.title ?? selectedList?.name,
      });

  const itemTitle = selectedItem?.isNew
    ? i18n("list.item.add")
    : i18n("list.item.edit", {
        title: selectedItem?.title,
      });

  return {
    isEditingList,
    isEditingListItem,
    showWarning,
    selectedList,
    selectedItem,
    closeFlyout,
    listTitle,
    itemTitle,
  };
};

export function ListsEdit({ showEditLists = false }: Props) {
  const {
    isEditingList,
    isEditingListItem,
    showWarning,
    closeFlyout,
    listTitle,
    itemTitle,
  } = useListsEdit();

  return (
    <div className="govuk-body">
      {!showEditLists && <ListSelect />}

      {isEditingList && (
        <RenderInPortal>
          <Flyout
            title={listTitle}
            onHide={closeFlyout(ListsEditorStateActions.IS_EDITING_LIST)}
            width={""}
          >
            {showWarning && <Warning />}
            <ListEdit />
          </Flyout>
        </RenderInPortal>
      )}

      {isEditingListItem && (
        <RenderInPortal>
          <Flyout
            title={itemTitle}
            width={""}
            onHide={closeFlyout(ListsEditorStateActions.IS_EDITING_LIST_ITEM)}
          >
            <ListItemEdit />
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  );
}

export default ListsEdit;
