import Wreck from "@hapi/wreck";

import config from "../../config";
import type { PersistenceService } from "./persistenceService";

/**
 * Persistence service that relies on the runner for storing
 * the form configurations in memory.
 * This should likely never be used in production but is a handy
 * development utility.
 */

// @ts-nocheck
export class PreviewPersistenceService implements PersistenceService {
  logger: any;

  async uploadConfiguration(id: string, configuration: string) {
    Wreck.post(`${config.publishUrl}/publish`, {
      payload: JSON.stringify({ id, configuration }),
    });
  }

  async copyConfiguration(configurationId: string, newName: string) {
    const configuration = await this.getConfiguration(configurationId);
    return this.uploadConfiguration(newName, JSON.parse(configuration).values);
  }

  async listAllConfigurations() {
    const { payload } = await Wreck.get(`${config.publishUrl}/published`);
    return JSON.parse((payload as object).toString());
  }

  async getConfiguration(id: string) {
    const { payload } = await Wreck.get(`${config.publishUrl}/published/${id}`);
    return (payload as object).toString();
  }

  async deleteConfiguration(_configurationId: string): Promise<any> {
    return "";
  }
}
