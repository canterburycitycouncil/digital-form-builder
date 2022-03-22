import Wreck from "@hapi/wreck";
import config from "../../config";
import { FormConfiguration } from "../../../../model";
import { ResponseToolkit } from "@hapi/hapi";

export const getPublished = async function (id, persistenceService) {
  if (config.persistentBackend === "dynamoDB") {
    const payload = persistenceService.getConfiguration(id);
    return payload;
  } else {
    const { payload } = await Wreck.get<FormConfiguration>(
      `${config.publishUrl}/published/${id}`
    );
    return payload.toString();
  }
};

export const returnResponse = (
  h: ResponseToolkit,
  message: any,
  code: number,
  type?: string
) => {
  if (type) {
    return h.response(message).code(code).type(type);
  } else {
    return h.response(message).code(code);
  }
};
