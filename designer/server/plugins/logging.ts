import pino from "hapi-pino";

import config from "../config";

export default {
  plugin: pino,
  options: {
    prettyPrint: config.isDev,
    level: config.logLevel,
    logEvents: ["onPostStart", "onPostStop", "request-error"],
  },
};
