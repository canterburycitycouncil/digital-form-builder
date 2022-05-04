import { IntegrationLog } from "../../server/plugins/routes/types";
import { Submission, SubmissionKey } from "../pages/Submissions/types";

interface AllSubmissionsResponse {
  submissions: Submission[];
  lastKey?: SubmissionKey;
}

export class SubmissionApi {
  async getSubmissionsForForm(
    formId: string,
    subType: string,
    lastEvaluatedKey?: SubmissionKey
  ): Promise<AllSubmissionsResponse> {
    return new Promise((resolve, reject) => {
      const url = `/api/${formId}/submissions?subType=${subType}${
        lastEvaluatedKey
          ? `&lastKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`
          : ""
      }`;
      window
        .fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.json())
        .then((res) => {
          let submissionRes: AllSubmissionsResponse = {
            submissions: res.submissions as Submission[],
          };
          if (res.lastKey) {
            submissionRes.lastKey = res.lastKey;
          }
          resolve(submissionRes);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getSubmission(
    formId: string,
    submissionId: string
  ): Promise<Submission> {
    const url = `/api/${formId}/submissions/${submissionId}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res as Submission);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getIntegrationLogs(
    formId: string,
    submissionId: string
  ): Promise<IntegrationLog[]> {
    const url = `/api/${formId}/submissions/${submissionId}/integration-logs`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res.Items as IntegrationLog[]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getIntegrationLog(
    formId: string,
    submissionId: string,
    integrationId: string
  ): Promise<IntegrationLog> {
    const url = `/api/${formId}/submissions/${submissionId}/integration-logs/${integrationId}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res as IntegrationLog);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
