import React from "react";
import { Submission } from "../types";

interface Props {
  submissions: Submission[];
  parentPath: string;
}

export const SubmissionsTable = ({ submissions, parentPath }: Props) => {
  return (
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Submission id
          </th>
          <th scope="col" className="govuk-table__header">
            Started at
          </th>
          <th scope="col" className="govuk-table__header">
            Completed at
          </th>
          <th scope="col" className="govuk-table__header">
            Status
          </th>
          <th scope="col" className="govuk-table__header">
            User ID
          </th>
        </tr>
      </thead>
      <tbody>
        {submissions.map(
          (submission) =>
            submission && (
              <tr key={submission.submissionId} className="govuk-table__row">
                <td className="govuk-table__cell">
                  <p>
                    <a href={`${parentPath}/${submission.submissionId}`}>
                      {submission.submissionId}
                    </a>
                  </p>
                </td>
                <td className="govuk-table__cell">
                  <p>{submission.startedAt}</p>
                </td>
                <td className="govuk-table__cell">
                  <p>
                    {submission.updatedAt && submission.status === "Submitted"
                      ? submission.updatedAt
                      : "incomplete"}
                  </p>
                </td>
                <td className="govuk-table__cell">
                  <p>{submission.status}</p>
                </td>
                <td className="govuk-table__cell">
                  <p>{submission.userId}</p>
                </td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
};
