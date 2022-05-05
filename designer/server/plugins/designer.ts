import { envStore, flagg } from "flagg";

import * as pkg from "../../package.json";
import { HapiServer } from "../types";
import { api, app, newConfig } from "./routes";

export const designerPlugin = {
  plugin: {
    name: pkg["name"],
    version: pkg["version"],
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
      Object.keys(api).forEach((routeName) => {
        server.route(api[routeName]);
      });
    },
  },
};
