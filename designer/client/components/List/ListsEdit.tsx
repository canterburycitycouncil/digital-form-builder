import { Flyout } from "@xgovformbuilder/designer/client/components/Flyout";
import { RenderInPortal } from "@xgovformbuilder/designer/client/components/RenderInPortal";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { Page } from "@xgovformbuilder/model/src";
import React, { useContext } from "react";

import ListEdit from "./ListEdit";
import ListItemEdit from "./ListItemEdit";
import ListSelect from "./ListSelect";
import {
  ListsEditorContext,
  ListsEditorStateActions,
} from "./reducers/list/listsEditorReducer";
import { ListContext } from "./reducers/listReducer";
import { Warning } from "./Warning";

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
            {showWarning ? <Warning /> : ""}
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
