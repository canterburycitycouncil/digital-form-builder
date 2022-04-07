import React, { useEffect, useState } from "react";
import { Submission, submissionStatusClasses } from "./types";
import { SubmissionApi } from "../../api/submissionApi";
import SubmissionMenu from "./components/submission-menu";
import { Tabs } from "govuk-react-jsx";
import { SubmissionFormValues } from "./components/submission-form-values";
import { IntegrationLog } from "../../../server/plugins/routes/types";
import { IntegrationsTable } from "./components/integrations-table";
import "./submissions.scss";

interface Props {
  match?: any;
  location?: any;
  history?: any;
}

export const SubmissionView = (props: Props) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const api = new SubmissionApi();

  useEffect(() => {
    if (!submission && !loading) {
      setLoading(true);
      api
        .getSubmission(
          props.match?.params?.id,
          props.match?.params?.submissionId
        )
        .then((res) => {
          setLoading(false);
          setSubmission(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (integrationLogs.length === 0 && submission && !loading) {
      console.log("hello");
      setLoading(true);
      api
        .getIntegrationLogs(
          props.match?.params?.id,
          props.match?.params?.submissionId
        )
        .then((res) => {
          setLoading(false);
          setIntegrationLogs(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    submission,
    loading,
    integrationLogs,
    api,
    props.match?.params?.id,
    props.match?.params?.submissionId,
  ]);

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  };

  console.log(submission);

  return (
    <React.Fragment>
      <SubmissionMenu />
      {submission && (
        <>
          <div className="submission-details-container">
            <h1 className="govuk-heading-m">
              {submission.submissionId}{" "}
              <span
                className={`submission-status ${
                  submissionStatusClasses[submission.status]
                }`}
              >
                {submission.status}
              </span>
            </h1>
            <div className="submission-meta-table">
              <div className="submission-meta-item">
                <span className="meta-item-label">User ID</span>
                <span className="meta-item-value">{submission.userId}</span>
              </div>
              <div className="submission-meta-item">
                <span className="meta-item-label">Started at</span>
                <span className="meta-item-value">
                  {formatDate(submission.startedAt)}
                </span>
              </div>
              <div className="submission-meta-item">
                <span className="meta-item-label">Completed at</span>
                <span className="meta-item-value">
                  {submission.updatedAt && submission.status === "Submitted"
                    ? formatDate(submission.updatedAt)
                    : "Not completed"}
                </span>
              </div>
            </div>
          </div>
          <div className="submission-tabs">
            <Tabs
              idPrefix=""
              title=""
              items={[
                {
                  id: "form-values",
                  label: "Form values",
                  panel: {
                    children: [
                      <SubmissionFormValues
                        key={`submissionValues-${submission.submissionId}`}
                        formValues={submission.formValues}
                      />,
                    ],
                  },
                },
                {
                  id: "integration-logs",
                  label: "Integration logs",
                  panel: {
                    children: [
                      <IntegrationsTable
                        key={`integrationsTable-${submission.submissionId}`}
                        integrationLogs={integrationLogs}
                        parentPath={location.pathname}
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
