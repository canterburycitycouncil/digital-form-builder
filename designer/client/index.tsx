import "./styles/index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { initI18n } from "./i18n";
import Designer from "./pages/Designer/designer";
import { SaveError } from "./pages/ErrorPages";
import { ChooseExisting, LandingChoice, NewConfig } from "./pages/LandingPage";
import { OutputsDesigner } from "./pages/Outputs";
import { Submissions } from "./pages/Submissions";
import { Integration } from "./pages/Submissions/integration";
import { SubmissionView } from "./pages/Submissions/submission";

initI18n();

function NoMatch() {
  return <div>404 Not found</div>;
}

export class App extends React.Component {
  render() {
    return (
      <Router basename="/app">
        <div id="app" className="js-enabled">
          <Switch>
            <Route
              path="/designer/:id/submissions/:submissionId/integration-logs/:integrationId"
              component={Integration}
            />
            <Route
              path="/designer/:id/submissions/:submissionId"
              component={SubmissionView}
            />
            <Route path="/designer/:id/submissions" component={Submissions} />
            <Route path="/designer/:id/outputs" component={OutputsDesigner} />
            <Route path="/designer/:id" component={Designer} />
            <Route path="/" exact>
              <LandingChoice />
            </Route>
            <Route path="/new" exact>
              <NewConfig />
            </Route>
            <Route path="/choose-existing" exact>
              <ChooseExisting />
            </Route>
            <Route path="/save-error" exact>
              <SaveError />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
