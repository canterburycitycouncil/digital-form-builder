import { returnResponse } from "../../helpers";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { Schema } from "../../../../../../model";

export const putFormWithIdHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const { persistenceService } = request.services([]);

  try {
    const { value, error } = Schema.validate(request.payload, {
      abortEarly: false,
    });

    if (error) {
      request.logger.error(
        ["error", `/api/${id}/data`],
        [(error as Error).message, request.payload].join("\n")
      );

      throw new Error("Schema validation failed, reason: " + error.message);
    }
    await persistenceService.uploadConfiguration(
      `${id}`,
      JSON.stringify(value)
    );
    const response = { ok: true };
    return returnResponse(h, response, 204, "application/json");
  } catch (err) {
    request.logger.error(
      "Designer Server PUT /api/{id}/data error:",
      (err as Error).message
    );
    const errorSummary = {
      id: id,
      payload: request.payload,
      errorMessage: (err as Error).message,
      error: (err as Error).stack,
    };
    request.yar.set(`error-summary-${id}`, errorSummary);
    const response = {
      ok: true,
      err,
    };
    return returnResponse(h, response, 401, "application/json");
  }
};
