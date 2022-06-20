export enum OutputType {
  Email = "email",
  Notify = "notify",
  Webhook = "webhook",
  Freshdesk = "freshdesk",
  S3FileUpload = "s3fileupload",
  Topdesk = "topdesk",
}

export type EmailOutputConfiguration = {
  emailAddress: string;
};

export type NotifyOutputConfiguration = {
  apiKey: string;
  templateId: string;
  emailField: string;
  personalisation: string[];
  addReferencesToPersonalisation?: boolean;
};

export type WebhookOutputConfiguration = {
  url: string;
};

export type FreshdeskOutputConfiguration = {
  freshdeskHost: string;
  apiKey: string;
  customFields: string;
};

export type S3FileUploadOutputConfiguration = {
  apiKey: string;
  endpoint: string;
};

export type TopdeskOutputConfiguration = {
  endpoint: string;
  username: string;
  password: string;
};

export type OutputConfiguration =
  | EmailOutputConfiguration
  | NotifyOutputConfiguration
  | WebhookOutputConfiguration
  | FreshdeskOutputConfiguration
  | S3FileUploadOutputConfiguration
  | TopdeskOutputConfiguration;

export type Output = {
  name: string;
  title: string;
  type: OutputType;
  outputConfiguration: OutputConfiguration;
  previous: string;
  previousValues: string[];
  next: string[];
};

export interface ValidationError {
  href?: string;
  children: string;
}

export type ValidationErrors = {
  title?: ValidationError;
  name?: ValidationError;
  email?: ValidationError;
  endpoint?: ValidationError;
  username?: ValidationError;
  password?: ValidationError;
  templateId?: ValidationError;
  freshdeskHost?: ValidationError;
  apiKey?: ValidationError;
  url?: ValidationError;
  customFields?: ValidationError;
};

export const responses = {
  email: {
    title: "string",
    recipients: "string[]",
    successes: "number",
    failures: "number",
  },
  notify: {},
  webhook: {},
  freshdesk: {
    id: "string",
  },
  s3fileupload: {
    url: "string",
  },
};
