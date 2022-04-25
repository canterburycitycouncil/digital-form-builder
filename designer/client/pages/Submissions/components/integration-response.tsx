import React from "react";
import { IntegrationLog } from "../../../../server/plugins/routes/types";

interface Props {
  integrationLog: IntegrationLog;
}

export const IntegrationResponse = ({ integrationLog }: Props) => {
  const response = integrationLog.response;
  return (
    <div className="integration-response-container">
      {response && typeof response === "object" ? (
        <pre>{JSON.stringify(response, null, " ")}</pre>
      ) : (
        <p>This integration did not return a response</p>
      )}
    </div>
  );
};
