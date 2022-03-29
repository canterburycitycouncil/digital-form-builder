import { FormDefinition } from "../../../../../model";
import {
  OutputConfiguration,
  OutputType,
} from "../../../../client/outputs/types";

export interface OutputRequest {
  formScheme: FormDefinition;
  submission: {
    [key: string]: any;
  };
  files: Buffer | Buffer[];
  filenames: string | string[];
  fileTypes: string | string[];
}

export interface IntegrationLog {
  integrationId?: string;
  submissionId: string;
  integrationName: string;
  configuration: OutputConfiguration;
  integrationType: OutputType;
  request: {
    [key: string]: any;
  };
  response?: any;
}
