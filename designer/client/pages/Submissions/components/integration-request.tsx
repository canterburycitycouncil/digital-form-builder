import React from "react";

import { IntegrationLog } from "../../../../server/plugins/routes/types";

interface Props {
  integrationLog: IntegrationLog;
}

export const IntegrationRequest = ({ integrationLog }: Props) => {
  const request = integrationLog.request;

  return (
    <div className="integration-request-container">
      <pre>{JSON.stringify(request, null, " ")}</pre>
    </div>
  );
};
