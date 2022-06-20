import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

import { returnResponse } from "../../helpers";

export const getAllPersistedConfigurationsHandler = async (
  request: Request,
  h: ResponseToolkit
): Promise<ResponseObject | undefined> => {
  const { persistenceService } = request.services([]);
  try {
    const response = await persistenceService.listAllConfigurations();
    return returnResponse(h, response, 200, "application/json");
  } catch (error) {
    request.server.log(["error", "/configurations"], error as Error);
    return;
  }
};
