import React from "react";
import { i18n } from "../../../i18n";
import { useHistory, useLocation } from "react-router-dom";

// Should probably configure TS base url to avoid having to go back folders instead linking them is a lot simpler.

export default function SubmissionMenu() {
  const history = useHistory();
  const location = useLocation();

  const backToSubmissions = () => {
    let submissionLink = (location.pathname as string).split("/");
    submissionLink.pop();
    history.push(submissionLink.join("/"));
  };

  return (
    <nav className="menu">
      <div className="menu__row">
        <button
          data-testid="menu-back-to-submissions"
          onClick={backToSubmissions}
        >
          {i18n("submissions.menu.backToSubmissions")}
        </button>
      </div>
    </nav>
  );
}
