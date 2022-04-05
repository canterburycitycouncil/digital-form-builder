import React from "react";
import { i18n } from "../../i18n";
import { useHistory, useLocation } from "react-router-dom";

// Should probably configure TS base url to avoid having to go back folders instead linking them is a lot simpler.

export default function Menu() {
  const history = useHistory();
  const location = useLocation();

  const backToForm = () => {
    const formLink = location.pathname.replace("/submissions", "");
    history.push(formLink);
  };

  return (
    <nav className="menu">
      <div className="menu__row">
        <button data-testid="menu-back-to-form" onClick={backToForm}>
          {i18n("submissions.menu.backToForm")}
        </button>
      </div>
    </nav>
  );
}
