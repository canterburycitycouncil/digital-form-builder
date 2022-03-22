import { getPublished } from "../../helpers";
import newFormJson from "../../../../../new-form.json";
import { returnResponse } from "../../helpers";
import { Request, ResponseToolkit } from "@hapi/hapi";

export const getFormWithIdHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  let formJson = newFormJson;
  try {
    let response;
    const { persistenceService } = request.services([]);
    response = await getPublished(id, persistenceService);
    const values = JSON.parse(response);
    if (values) {
      values.pages = values.pages;
      formJson = values;
    }
  } catch (error) {
    request.logger.error(error as Error);
  }

  return returnResponse(h, formJson, 200, "application/json");
};
