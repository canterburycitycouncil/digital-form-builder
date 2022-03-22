import { ServerRoute } from "@hapi/hapi";
import {
  deleteFormWithIdHandler,
  getAllPersistedConfigurationsHandler,
  getFormWithIdHandler,
  logHandler,
  putFormWithIdHandler,
  runOutputsHandler,
} from "./handlers";

export const getFormWithId: ServerRoute = {
  // GET DATA
  method: "GET",
  path: "/api/{id}/data",
  options: {
    handler: getFormWithIdHandler,
  },
};

export const runOutputs: ServerRoute = {
  method: "POST",
  path: "/api/outputs",
  options: {
    payload: {
      parse: true,
      allow: ["application/json", "multipart/form-data"],
      output: "data",
      multipart: {
        output: "data",
      },
      maxBytes: 209715200,
    },
    cors: {
      origin: ["http://localhost:8000"],
    },
    handler: runOutputsHandler,
  },
};

export const putFormWithId: ServerRoute = {
  // SAVE DATA
  method: "PUT",
  path: "/api/{id}/data",
  options: {
    payload: {
      parse: true,
    },
    handler: putFormWithIdHandler,
  },
};

export const deleteFormWithId: ServerRoute = {
  method: "DELETE",
  path: "/api/{id}",
  options: {
    handler: deleteFormWithIdHandler,
  },
};

export const getAllPersistedConfigurations: ServerRoute = {
  method: "GET",
  path: "/api/configurations",
  options: {
    handler: getAllPersistedConfigurationsHandler,
  },
};

export const log: ServerRoute = {
  method: "POST",
  path: "/api/log",
  options: {
    handler: logHandler,
  },
};
