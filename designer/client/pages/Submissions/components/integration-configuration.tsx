import React from "react";

import { IntegrationLog } from "../../../../server/plugins/routes/types";

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
            {Array.isArray(integrationLog.configuration[key]) ? (
              <React.Fragment>
                {typeof integrationLog.configuration[key][0] === "object" ? (
                  <table className="config-value-table">
                    <thead>
                      <tr>
                        {Object.keys(integrationLog.configuration[key][0]).map(
                          (configKey) => (
                            <th key={`${key}-config-item-heading-${configKey}`}>
                              {configKey}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {integrationLog.configuration[key].map(
                        (configItem, index) => (
                          <tr key={`${key}-config-item-${index}`}>
                            {Object.keys(configItem).map((configItemKey) => (
                              <td
                                key={`${key}-config-item-${index}-value-${configItemKey}`}
                              >
                                {configItem[configItemKey]}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <React.Fragment>
                    {integrationLog.configuration[key].map(
                      (configItem, index) => (
                        <span key={`${key}-config-item-${index}`}>
                          {configItem}
                        </span>
                      )
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              integrationLog.configuration[key]
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
