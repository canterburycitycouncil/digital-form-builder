import React from "react";
import { IntegrationLog } from "../../../server/plugins/routes/types";

interface Props {
  integrationLog: IntegrationLog;
}

export const IntegrationConfiguration = ({ integrationLog }: Props) => {
  return (
    <div className="integration-configuration-container">
      {Object.keys(integrationLog.configuration).map((key) => (
        <div
          key={`integration-configuration-${integrationLog.integrationId}-${key}`}
          className="form-value"
        >
          <span className="field-label">{key}</span>
          <span className="field-value">
            {integrationLog.configuration[key]}
          </span>
        </div>
      ))}
    </div>
  );
};
