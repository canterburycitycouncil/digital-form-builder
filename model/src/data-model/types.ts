import { ComponentDef } from "../components/types";
import { ConditionRawData } from ".";

export interface Next {
  path: string;
  condition?: string;
}
export type Link = Next;

export interface Page {
  title: string;
  path: string;
  controller: string;
  components?: ComponentDef[];
  section: string; // the section ID
  next?: { path: string; condition?: string }[];
}

export interface Section {
  name: string;
  title: string;
}

export interface Item {
  text: string;
  value: string | number | boolean;
  description?: string;
  condition?: string;
}

export interface List {
  name: string;
  title: string;
  type: "string" | "number" | "boolean";
  items: Item[];
}

export type LogicExpressionTypes =
  | "predefined"
  | "literal"
  | "mathematical"
  | "conditional";
export interface LogicExpression {
  label: string;
  variableName: string;
  expressionType: LogicExpressionTypes;
  expression: string;
}

export interface Feedback {
  feedbackForm?: boolean;
  url?: string;
  emailAddress?: string;
}

export type PhaseBanner = {
  phase?: "alpha" | "beta";
  feedbackUrl?: string;
};

export type MultipleApiKeys = {
  test?: string;
  production?: string;
};

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

export type SpecialPages = {
  confirmationPage?: {
    components: ComponentDef[];
  };
};

export type Fee = {
  description: string;
  amount: number;
  multiplier?: string;
  condition?: string;
};

export function isMultipleApiKey(
  payApiKey: string | MultipleApiKeys | undefined
): payApiKey is MultipleApiKeys {
  let obj = payApiKey as MultipleApiKeys;
  return obj.test !== undefined || obj.production !== undefined;
}

/**
 * `FormDefinition` is a typescript representation of `Schema`
 */
export type FormDefinition = {
  id: string;
  internalOnly: boolean;
  pages: Page[];
  conditions: ConditionRawData[];
  lists: List[];
  sections: Section[];
  startPage?: Page["path"] | undefined;
  title?: string;
  feedback?: Feedback;
  phaseBanner?: PhaseBanner;
  fees: Fee[];
  skipSummary?: boolean | undefined;
  outputs: Output[];
  declaration?: string | undefined;
  metadata?: Record<string, any>;
  payApiKey?: string | MultipleApiKeys | undefined;
  specialPages?: SpecialPages;
  logicExpressions: LogicExpression[];
  submissionMessage?: string;
};
