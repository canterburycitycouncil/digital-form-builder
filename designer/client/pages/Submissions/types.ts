export interface Submission {
  submissionId: string;
  submissionType: string;
  formId: string;
  startedAt: string;
  updatedAt?: string;
  status: string;
  userId: string;
  formValues: {
    [key: string]: any;
  };
}

export interface SubmissionKey {
  submissionType: string;
  submissionId: string;
  formId: string;
}

export const submissionStatusClasses = {
  "not complete": "incomplete",
  Submitted: "submitted",
};
