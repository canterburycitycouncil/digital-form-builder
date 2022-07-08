import ListsEdit from "@xgovformbuilder/designer/client/components/List/ListsEdit";
import { ListsEditorContextProvider } from "@xgovformbuilder/designer/client/components/List/reducers/list/listsEditorReducer";
import { ListContextProvider } from "@xgovformbuilder/designer/client/components/List/reducers/listReducer";
import { RenderInPortal } from "@xgovformbuilder/designer/client/components/RenderInPortal";
import { Page } from "@xgovformbuilder/model";
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
