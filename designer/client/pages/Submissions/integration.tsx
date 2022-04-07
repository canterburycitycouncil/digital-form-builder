import React, { useEffect, useState } from "react";
import { IntegrationLog } from "../../../server/plugins/routes/types";
import { SubmissionApi } from "../../api/submissionApi";
import { IntegrationConfiguration } from "./components/integration-configuration";
import { IntegrationMenu } from "./components/integration-menu";
import { IntegrationRequest } from "./components/integration-request";
import { IntegrationResponse } from "./components/integration-response";
import { Tabs } from "govuk-react-jsx";

interface Props {
  match?: any;
  location?: any;
  history?: any;
}

export const Integration = (props: Props) => {
  const [integration, setIntegration] = useState<IntegrationLog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const api = new SubmissionApi();

  useEffect(() => {
    if (!integration && !loading) {
      setLoading(true);
      api
        .getIntegrationLog(
          props.match?.params.id,
          props.match?.params?.submissionId,
          props.match?.params?.integrationId
        )
        .then((res) => {
          setIntegration(res);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  });
  return (
    <React.Fragment>
      <IntegrationMenu />
      {integration && (
        <>
          <div className="integration-details-container">
            <h1 className="govuk-heading-m">
              {integration.integrationId}{" "}
              <span className="integration-status success">Success</span>
            </h1>
            <div className="integration-meta-table">
              <div className="integration-meta-item">
                <span className="meta-item-label">Title</span>
                <span className="meta-item-value">
                  {integration.integrationName}
                </span>
              </div>
              <div className="integration-meta-item">
                <span className="meta-item-label">Type</span>
                <span className="meta-item-value">
                  {integration.integrationType}
                </span>
              </div>
            </div>
          </div>
          <div className="integration-tabs">
            <Tabs
              idPrefix=""
              title=""
              items={[
                {
                  id: "integration-configuration",
                  label: "Configuration",
                  panel: {
                    children: [
                      <IntegrationConfiguration
                        key="integration-configuration"
                        integrationLog={integration}
                      />,
                    ],
                  },
                },
                {
                  id: "integration-request",
                  label: "Request",
                  panel: {
                    children: [
                      <IntegrationRequest
                        key="integration-request"
                        integrationLog={integration}
                      />,
                    ],
                  },
                },
                {
                  id: "integration-response",
                  label: "Response",
                  panel: {
                    children: [
                      <IntegrationResponse
                        key="integration-response"
                        integrationLog={integration}
                      />,
                    ],
                  },
                },
              ]}
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
};
