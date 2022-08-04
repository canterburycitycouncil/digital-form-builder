import "../submissions.scss";

import React from "react";

import { IntegrationLog } from "../../../../server/plugins/routes/types";

interface Props {
  integrationLogs: IntegrationLog[];
  parentPath: string;
}

export const IntegrationsTable = ({ integrationLogs, parentPath }: Props) => {
  return (
    <table className="govuk-table integration-log-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Integration id
          </th>
          <th scope="col" className="govuk-table__header">
            Integration name
          </th>
          <th scope="col" className="govuk-table__header">
            Result
          </th>
        </tr>
      </thead>
      <tbody>
        {integrationLogs.map((log) => (
          <tr key={log.integrationId} className="govuk-table__row">
            <td className="govuk-table__cell">
              <p>
                <a href={`${parentPath}/integration-logs/${log.integrationId}`}>
                  {log.integrationId}
                </a>
              </p>
            </td>
            <td className="govuk-table__cell">
              <p>{log.integrationName}</p>
            </td>
            <td className="govuk-table__cell">
              <p>
                <span
                  className={`integration-status ${log.result ?? "unknown"}
                `}
                >
                  {log.result ?? "unknown"}
                </span>
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
