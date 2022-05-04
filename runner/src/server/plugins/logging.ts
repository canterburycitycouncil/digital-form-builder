import pino from "hapi-pino";
import config from "runner/src/server/config";

export default {
  plugin: pino,
  options: {
    prettyPrint: config.isDev,
    level: config.logLevel,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    logRequestComplete: config.isDev,
  },
};
