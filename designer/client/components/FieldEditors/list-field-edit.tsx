import { Page } from "@xgovformbuilder/data-model";
import ComponentListSelect from "designer/client/components/ComponentListSelect/ComponentListSelect";
import { RenderInPortal } from "designer/client/components/RenderInPortal";
import ListsEdit from "designer/client/list/ListsEdit";
import { ListsEditorContextProvider } from "designer/client/reducers/list/listsEditorReducer";
import { ListContextProvider } from "designer/client/reducers/listReducer";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  page: Page;
};

function ListFieldEdit({ children, page }: Props) {
  return (
    <ListsEditorContextProvider>
      <ListContextProvider>
        <ComponentListSelect />
        {children}
        <RenderInPortal>
          <ListsEdit showEditLists={true} page={page} />
        </RenderInPortal>
      </ListContextProvider>
    </ListsEditorContextProvider>
  );
}

export default ListFieldEdit;
