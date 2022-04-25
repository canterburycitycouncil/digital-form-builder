import React, { useContext } from "react";
import { Flyout } from "../Flyout";
import { ListsEditorContextProvider } from "../List/reducers/list/listsEditorReducer";
import { ListContextProvider } from "../List/reducers/listReducer";
import { DataContext } from "../../context";
import { MenuItemHook, useMenuItem } from "./useMenuItem";
import { SubMenu } from "./SubMenu";
import { useHistory, useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
import getMenuItems from "./MenuItems";

type Props = {
  updateDownloadedAt?: (string) => void;
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
