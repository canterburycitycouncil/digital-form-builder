import { Page } from "@xgovformbuilder/data-model";
import ListsEdit from "designer/client/components/List/ListsEdit";
import { ListsEditorContextProvider } from "designer/client/components/List/reducers/list/listsEditorReducer";
import { ListContextProvider } from "designer/client/components/List/reducers/listReducer";
import { RenderInPortal } from "designer/client/components/RenderInPortal";
import React, { ReactNode } from "react";

import ComponentListSelect from "../components/ComponentListSelect/ComponentListSelect";

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
