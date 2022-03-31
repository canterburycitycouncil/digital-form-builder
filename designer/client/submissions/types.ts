export interface Submission {
  submissionId: string;
  submissionType: string;
  formId: string;
  startedAt: string;
  completedAt?: string;
  status: string;
  userId: string;
  formValues: string;
}

export interface SubmissionKey {
  submissionType: string;
  submissionId: string;
  formId: string;
}
