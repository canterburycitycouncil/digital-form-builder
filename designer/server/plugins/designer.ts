import { api, app, newConfig } from "designer/server/plugins/routes";
import { envStore, flagg } from "flagg";
import pkg from "package.json";

import { HapiServer } from "../types";

export const designerPlugin = {
  plugin: {
    name: pkg.name,
    version: pkg.version,
    multiple: true,
    dependencies: "vision",
    register: async (server: HapiServer) => {
      server.route({
        method: "get",
        path: "/",
        options: {
          handler: async (_request, h) => {
            return h.redirect("/app");
          },
        },
      });

      // This is old url , redirecting it to new
      server.route(app.redirectNewToApp);

      server.route(app.getApp);

      server.route(app.getAppChildRoutes);

      server.route(app.getErrorCrashReport);

      // This is old url , redirecting it to new
      server.route(app.redirectOldUrlToDesigner);

      server.route({
        method: "GET",
        path: "/feature-toggles",
        options: {
          handler: async (_request, h) => {
            const featureFlags = flagg({
              store: envStore(process.env),
              definitions: {
                featureEditPageDuplicateButton: { default: false },
              },
            });

            return h
              .response(JSON.stringify(featureFlags.getAllResolved()))
              .code(200);
          },
        },
      });

      server.route(newConfig.registerNewFormWithRunner);
      server.route(api.getFormWithId);
      server.route(api.putFormWithId);
      server.route(api.getAllPersistedConfigurations);
      server.route(api.runOutputs);
      server.route(api.saveSubmission);
      server.route(api.deleteFormWithId);
      server.route(api.log);
    },
  },
};
