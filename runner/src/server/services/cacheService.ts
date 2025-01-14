import CatboxMemory from "@hapi/catbox-memory";
import CatboxRedis from "@hapi/catbox-redis";
import hoek from "hoek";
import Redis from "ioredis";
import config from "runner/src/server/config";
import { FormSubmissionState } from "runner/src/server/plugins/engine/types";
import { HapiRequest, HapiServer } from "runner/src/server/types";

const {
  redisHost,
  redisPort,
  redisPassword,
  redisTls,
  isSandbox,
  sessionTimeout,
} = config;
const partition = "cache";

enum ADDITIONAL_IDENTIFIER {
  Confirmation = ":confirmation",
}

export class CacheService {
  /**
   * This service is responsible for getting, storing or deleting a user's session data in the cache. This service has been registered by {@link createServer}
   */
  cache: any;
  logger: HapiServer["logger"];

  constructor(server: HapiServer) {
    this.cache = server.cache({ segment: "cache" });
    this.logger = server.logger;
  }

  async getState(request: HapiRequest): Promise<FormSubmissionState> {
    const cached = await this.cache.get(this.Key(request));
    return cached || {};
  }

  async mergeState(
    request: HapiRequest,
    value: object,
    nullOverride = true,
    arrayMerge = false
  ) {
    const key = this.Key(request);
    const state = await this.getState(request);
    hoek.merge(state, value, nullOverride, arrayMerge);
    await this.cache.set(key, state, sessionTimeout);
    return this.cache.get(key);
  }

  async getConfirmationState(request: HapiRequest) {
    const key = this.Key(request, ADDITIONAL_IDENTIFIER.Confirmation);
    return await this.cache.get(key);
  }

  async setConfirmationState(request: HapiRequest, viewModel) {
    const key = this.Key(request, ADDITIONAL_IDENTIFIER.Confirmation);
    return this.cache.set(key, viewModel, sessionTimeout);
  }

  async clearState(request: HapiRequest) {
    if (request.yar?.id) {
      this.cache.drop(this.Key(request));
    }
  }

  /**
   * The key used to store user session data against.
   * If there are multiple forms on the same runner instance, for example `form-a` and `form-a-feedback` this will prevent CacheService from clearing data from `form-a` if a user gave feedback before they finished `form-a`
   *
   * @param request - hapi request object
   * @param additionalIdentifier - appended to the id
   */
  Key(request: HapiRequest, additionalIdentifier?: ADDITIONAL_IDENTIFIER) {
    if (!request?.yar?.id) {
      throw Error("No session ID found");
    }
    return {
      segment: partition,
      id: `${request.yar.id}:${request.params.id}${additionalIdentifier}`,
    };
  }
}

export const catboxProvider = () => {
  /**
   * If redisHost doesn't exist, CatboxMemory will be used instead.
   * More information at {@link https://hapi.dev/module/catbox/api}
   */
  const provider = {
    constructor: redisHost ? CatboxRedis : CatboxMemory,
    options: {},
  };

  if (redisHost) {
    const redisOptions: {
      password?: string;
      tls?: {};
    } = {};

    if (redisPassword) {
      redisOptions.password = redisPassword;
    }

    if (redisTls) {
      redisOptions.tls = {};
    }

    const client = isSandbox
      ? new Redis({ host: redisHost, port: redisPort, password: redisPassword })
      : new Redis.Cluster(
          [
            {
              host: redisHost,
              port: redisPort,
            },
          ],
          {
            dnsLookup: (address, callback) => callback(null, address, 4),
            redisOptions,
          }
        );
    provider.options = { client, partition };
  } else {
    provider.options = { partition };
  }

  return provider;
};
