import { FormDefinition } from "../../../../../model";

export interface OutputRequest {
  formScheme: FormDefinition;
  submission: object;
  files: Buffer | Buffer[];
  filenames: string | string[];
  fileTypes: string | string[];
}
