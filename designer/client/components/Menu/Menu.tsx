import { Flyout } from "@xgovformbuilder/designer/client/components/Flyout";
import { ListsEditorContextProvider } from "@xgovformbuilder/designer/client/components/List/reducers/list/listsEditorReducer";
import { ListContextProvider } from "@xgovformbuilder/designer/client/components/List/reducers/listReducer";
import MenuButton from "@xgovformbuilder/designer/client/components/Menu/MenuButton";
import getMenuItems from "@xgovformbuilder/designer/client/components/Menu/MenuItems";
import { SubMenu } from "@xgovformbuilder/designer/client/components/Menu/SubMenu";
import {
  MenuItemHook,
  useMenuItem,
} from "@xgovformbuilder/designer/client/components/Menu/useMenuItem";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";

type Props = {
  updateDownloadedAt?: (arg0: string) => void;
  id: string;
  updatePersona?: any;
  history?: any;
};

const convertMenuItemName = (menuItem: string) => {
  if (menuItem.indexOf("-") > -1) {
    let firstPart = menuItem.substring(0, menuItem.indexOf("-"));
    let lastPart = menuItem.substring(menuItem.indexOf("-") + 1);
    lastPart = lastPart.substring(0, 1).toUpperCase() + lastPart.substring(1);
    menuItem = firstPart + lastPart;
  }
  return menuItem;
};

export default function Menu({ updateDownloadedAt, id }: Props) {
  const { data } = useContext(DataContext);
  const history = useHistory();
  const location = useLocation();

  const menuItemsObject = getMenuItems(useMenuItem, data);

  const goToOutputs = () => {
    let currentUrl = location.pathname;
    history.push(currentUrl + "/outputs");
  };

  const goToSubmissions = () => {
    let currentUrl = location.pathname;
    history.push(currentUrl + "/submissions");
  };

  return (
    <nav className="menu">
      <div className="menu__row">
        {Object.keys(menuItemsObject).map((key) => (
          <MenuButton
            key={key}
            dataTestId={`menu-${key}`}
            handleClick={(menuItemsObject[key].component as MenuItemHook).show}
            translationKey={`menu.${convertMenuItemName(key)}`}
          />
        ))}
        <MenuButton
          dataTestId="menu-outputs"
          handleClick={goToOutputs}
          translationKey="menu.outputs"
        />
        <MenuButton
          dataTestId="menu-submissions"
          handleClick={goToSubmissions}
          translationKey="menu.submissions"
        />
      </div>
      {Object.keys(menuItemsObject).map((key) => {
        const menuItem = menuItemsObject[key];
        if (key === "lists") {
          return (
            <>
              {menuItem.component.isVisible && (
                <Flyout
                  title={menuItem.flyout.title}
                  onHide={menuItem.component.hide}
                  width={menuItem.flyout.width ?? ""}
                >
                  <ListsEditorContextProvider>
                    <ListContextProvider>
                      <menuItem.flyout.component.type
                        {...menuItem.flyout.component.props}
                        onCreate={() => menuItem.component.hide}
                      />
                    </ListContextProvider>
                  </ListsEditorContextProvider>
                </Flyout>
              )}
            </>
          );
        }
        return (
          <>
            {menuItem.component.isVisible && (
              <Flyout
                title={menuItem.flyout.title}
                onHide={menuItem.component.hide}
                width={menuItem.flyout.width ?? ""}
              >
                <menuItem.flyout.component.type
                  {...menuItem.flyout.component.props}
                  onCreate={() => menuItem.component.hide}
                />
              </Flyout>
            )}
          </>
        );
      })}
      <SubMenu
        id={id}
        updateDownloadedAt={updateDownloadedAt}
        history={history}
      />
    </nav>
  );
}
