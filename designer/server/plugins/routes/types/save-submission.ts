export interface submissionPayload {
  formValues: {
    [key: string]: any;
  };
  submissionId?: string;
  submissionType: string;
  userId: string;
  formId: string;
  status: string;
}
