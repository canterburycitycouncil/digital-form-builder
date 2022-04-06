import React from "react";
import { i18n } from "../../i18n";
import { useHistory, useLocation } from "react-router-dom";

// Should probably configure TS base url to avoid having to go back folders instead linking them is a lot simpler.

export const IntegrationMenu = () => {
  const history = useHistory();
  const location = useLocation();

  const backToSubmission = () => {
    let submissionLink = (location.pathname as string).split("/");
    submissionLink.pop();
    submissionLink.pop();
    history.push(submissionLink.join("/"));
  };

  return (
    <nav className="menu">
      <div className="menu__row">
        <button
          data-testid="menu-back-to-submission"
          onClick={backToSubmission}
        >
          {i18n("integrations.menu.backToSubmission")}
        </button>
      </div>
    </nav>
  );
};
