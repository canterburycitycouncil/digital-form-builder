import { ServerRoute } from "@hapi/hapi";
import { nanoid } from "nanoid";

import newFormJson from "../../../new-form.json";
import config from "../../config";
import { publish } from "../../lib/publish";
import { HapiRequest } from "../../types";
import { newConfigPayload } from "./types";

export const registerNewFormWithRunner: ServerRoute = {
  method: "post",
  path: "/api/new",
  options: {
    handler: async (request: HapiRequest, h) => {
      const { persistenceService } = request.services([]);
      const { selected, name, formName } = request.payload as newConfigPayload;

      if (name && name !== "" && !name.match(/^[a-zA-Z0-9 _-]+$/)) {
        return h
          .response("Form name should not contain special characters")
          .type("application/json")
          .code(400);
      }

      const newName = name === "" ? nanoid(10) : name;

      try {
        if (selected.Key === "New") {
          if (config.persistentBackend !== "preview") {
            request.logger.error(newFormJson);
            await persistenceService.uploadConfiguration(
              `${newName}.json`,
              JSON.stringify({
                ...newFormJson,
                title: formName,
              })
            );
          }
          await publish(newName, {
            ...newFormJson,
            title: formName,
          });
        } else {
          // await persistenceService.copyConfiguration(
          //   `${selected.Key}`,
          //   newName
          // );
          const copied = await persistenceService.getConfiguration(
            selected.Key
          );
          await publish(selected.Key, copied);
        }
      } catch (e) {
        request.logger.error(e as Error);
      }

      const response = {
        id: `${name ? name : newName}`,
        previewUrl: config.previewUrl,
      };

      return h.response(response).type("application/json").code(200);
    },
  },
};
