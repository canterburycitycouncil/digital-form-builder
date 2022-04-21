import { ServerRoute } from "@hapi/hapi";
import {
  deleteFormWithIdHandler,
  getAllPersistedConfigurationsHandler,
  getFormSubmissionsHandler,
  getFormWithIdHandler,
  getIntegrationLogHandler,
  getIntegrationLogsHandler,
  getSubmissionHandler,
  logHandler,
  putFormWithIdHandler,
  runOutputsHandler,
  saveSubmissionHandler,
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
      origin: [
        "http://localhost:8000",
        "http://canterbury-formbuilder.s3-website.eu-west-2.amazonaws.com",
      ],
      headers: [
        "Accept",
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin",
        "Content-Type",
      ],
    },
    handler: runOutputsHandler,
  },
};

export const saveSubmission: ServerRoute = {
  method: "POST",
  path: "/api/submission",
  options: {
    payload: {
      parse: true,
    },
    cors: {
      origin: [
        "http://localhost:8000",
        "http://canterbury-formbuilder.s3-website.eu-west-2.amazonaws.com",
      ],
      headers: [
        "Accept",
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin",
        "Content-Type",
      ],
    },
    handler: saveSubmissionHandler,
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

export const getFormSubmissions: ServerRoute = {
  method: "GET",
  path: "/api/{id}/submissions",
  options: {
    handler: getFormSubmissionsHandler,
  },
};

export const getSubmission: ServerRoute = {
  method: "GET",
  path: "/api/{id}/submissions/{submissionId}",
  options: {
    handler: getSubmissionHandler,
  },
};

export const getIntegrationLogs: ServerRoute = {
  method: "GET",
  path: "/api/{id}/submissions/{submissionId}/integration-logs",
  options: {
    handler: getIntegrationLogsHandler,
  },
};

export const getIntegrationLog: ServerRoute = {
  method: "GET",
  path: "/api/{id}/submissions/{submissionId}/integration-logs/{integrationId}",
  options: {
    handler: getIntegrationLogHandler,
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
