import { FormDefinition } from "../../../../../model";

export interface OutputRequest {
  formScheme: FormDefinition;
  submission: {
    [key: string]: any;
  };
  files: Buffer | Buffer[];
  filenames: string | string[];
  fileTypes: string | string[];
}
