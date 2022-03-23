import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { returnResponse } from "../../helpers";

export const logHandler = async (
  request: Request,
  h: ResponseToolkit
): Promise<ResponseObject | undefined> => {
  try {
    request.server.log(request.payload.toString());
    const response = {
      ok: true,
    };
    return returnResponse(h, response, 204, "application/json");
  } catch (error) {
    const response = {
      ok: false,
    };
    // return h.response({ ok: false }).code(500);
    return returnResponse(h, response, 500, "application/json");
  }
};
