export enum OutputType {
  Email = "email",
  Notify = "notify",
  Webhook = "webhook",
  Freshdesk = "freshdesk",
  S3FileUpload = "s3fileupload",
  Topdesk = "topdesk",
  TopdeskIncident = "topdesk-incident",
}

export type EmailOutputConfiguration = {
  emailAddress: string;
};

export type NotifyOutputConfiguration = {
  apiKey: string;
  templateId: string;
  emailField: string;
  personalisation: {
    item: string;
    value: string;
  }[];
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
  template: string;
  email: string;
  briefDescription?: string;
};

export type TopdeskIncidentOutputConfiguration = {
  email: string;
  briefDescription: string;
};

export type OutputConfiguration =
  | EmailOutputConfiguration
  | NotifyOutputConfiguration
  | WebhookOutputConfiguration
  | FreshdeskOutputConfiguration
  | S3FileUploadOutputConfiguration
  | TopdeskOutputConfiguration
  | TopdeskIncidentOutputConfiguration;

export type Output = {
  name: string;
  condition?: string;
  title: string;
  type: OutputType;
  outputConfiguration: OutputConfiguration;
  previous: string;
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
