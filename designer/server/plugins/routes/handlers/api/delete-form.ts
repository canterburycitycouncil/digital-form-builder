import { Request, ResponseToolkit } from "@hapi/hapi";
import { returnResponse } from "../../helpers";

export const deleteFormWithIdHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  try {
    const { persistenceService } = request.services([]);
    await persistenceService.deleteConfiguration(id);
  } catch (error) {
    request.logger.error(error as Error);
    const response = { ok: false, message: error };
    return returnResponse(h, response, 500, "application/json");
  }
  const response = { ok: true };
  return returnResponse(h, response, 200, "application/json");
};
