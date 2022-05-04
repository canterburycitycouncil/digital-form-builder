import path from "path";
import config from "runner/src/server/config";
import { idFromFilename } from "runner/src/server/plugins/engine/helpers";
import { plugin } from "runner/src/server/plugins/engine/plugin";
import {
  FormConfiguration,
  loadPreConfiguredForms,
} from "runner/src/server/plugins/engine/services/configurationService";

type ConfigureEnginePlugin = (
  formFileName?: string,
  formFilePath?: string
) => {
  plugin: any;
  options: {
    modelOptions: {
      relativeTo: string;
      previewMode: any;
    };
    configs: {
      configuration: any;
      id: string;
    }[];
    previewMode: boolean;
  };
};

const relativeTo = __dirname;

type EngineOptions = {
  previewMode?: boolean;
};
export const configureEnginePlugin: ConfigureEnginePlugin = (
  formFileName,
  formFilePath,
  options?: EngineOptions
) => {
  let configs: FormConfiguration[];

  if (formFileName && formFilePath) {
    configs = [
      {
        configuration: require(path.join(formFilePath, formFileName)),
        id: idFromFilename(formFileName),
      },
    ];
  } else {
    configs = loadPreConfiguredForms();
  }

  const modelOptions = {
    relativeTo,
    previewMode: options?.previewMode ?? config.previewMode,
  };

  return {
    plugin,
    options: { modelOptions, configs, previewMode: config.previewMode },
  };
};
