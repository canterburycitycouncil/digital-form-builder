import { get, getJson, post } from "./httpService";
import { HapiServer } from "../types";

const DEFAULT_OPTIONS = {
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  timeout: 60000,
};

export class DataService {
  logger: any;
  constructor(server: HapiServer) {
    this.logger = server.logger;
  }

  /**
   * Posts data to a webhook
   * @param url - url of the webhook
   * @param data - object to send to the webhook
   * @returns object with the property `reference` webhook if the response returns with a reference number. If the call fails, the reference will be 'UNKNOWN'.
   */
  async postRequest(url: string, data: object) {
    const { payload } = await post(url, {
      ...DEFAULT_OPTIONS,
      payload: JSON.stringify(data),
    });

    try {
      const response = JSON.parse(payload);
      this.logger.info(
        ["DataService", "postRequest"],
        `Webhook request to ${url} submitted OK`
      );
      this.logger.debug(
        ["DataService", "postRequest", `RESPONSE: ${response}`],
        JSON.stringify(payload)
      );
      return response;
    } catch (error) {
      this.logger.error(["DataService", "postRequest"], error);
      return "UNKNOWN";
    }
  }

  async getRequest(url: string) {
    const { payload } = await getJson(url);

    try {
      this.logger.info(
        ["DataService", "getRequest"],
        `Webhook request to ${url} submitted OK`
      );
      this.logger.debug(
        ["DataService", "getRequest", `RESPONSE: ${payload}`],
        JSON.stringify(payload)
      );
      return payload[0];
    } catch (error) {
      this.logger.error(["DataService", "getRequest"], error);
      return "UNKNOWN";
    }
  }
}
