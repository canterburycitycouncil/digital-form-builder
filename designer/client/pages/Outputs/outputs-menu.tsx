import { Flyout } from "designer/client/components/Flyout";
import LinkCreate from "designer/client/components/Links/link-create";
import { useMenuItem } from "designer/client/components/Menu/useMenuItem";
import { DataContext } from "designer/client/context";
import { i18n } from "designer/client/i18n";
import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";

import OutputCreate from "./components/outputs/output-create";

// Should probably configure TS base url to avoid having to go back folders instead linking them is a lot simpler.

export default function Menu() {
  const { data } = useContext(DataContext);
  const history = useHistory();
  const location = useLocation();

  const output = useMenuItem();
  const link = useMenuItem();

  const backToForm = () => {
    const formLink = location.pathname.replace("/outputs", "");
    history.push(formLink);
  };
  // const sections = useMenuItem();
  // const conditions = useMenuItem();
  // const lists = useMenuItem();
  // const outputs = useMenuItem();
  // const fees = useMenuItem();
  // const summaryBehaviour = useMenuItem();
  // const summary = useMenuItem();
  // const logicExpression = useMenuItem();

  return (
    <nav className="menu">
      <div className="menu__row">
        <button data-testid="menu-back-to-form" onClick={backToForm}>
          {i18n("outputs.menu.backToForm")}
        </button>
        <button data-testid="menu-page" onClick={output.show}>
          {i18n("outputs.menu.addOutput")}
        </button>
        <button data-testid="menu-links" onClick={link.show}>
          {i18n("outputs.menu.links")}
        </button>
      </div>

      {output.isVisible && (
        <Flyout title={i18n("menu.outputs")} onHide={output.hide}>
          <OutputCreate
            data={data}
            onCreate={(e) => {
              output.hide(e);
            }}
          />
        </Flyout>
      )}

      {link.isVisible && (
        <Flyout title={i18n("menu.links")} onHide={link.hide}>
          <LinkCreate data={data} onCreate={() => link.hide} />
        </Flyout>
      )}
    </nav>
  );
}
