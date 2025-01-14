import {
  isMultipleApiKey,
  MultipleApiKeys,
} from "@xgovformbuilder/model/data-model/types";
import { NotifyClient } from "notifications-node-client/client/notification";
import config from "runner/src/server/config";
import { HapiServer } from "runner/src/server/types";

type Personalisation = {
  [propName: string]: any;
};

type SendEmailOptions = {
  personalisation: Personalisation;
  reference: string;
  emailReplyToId?: string;
};

export type SendNotificationArgs = {
  apiKey: string | MultipleApiKeys;
  templateId: string;
  emailAddress: string;
  personalisation: Personalisation;
  reference: string;
};

export class NotifyService {
  /**
   * This service is responsible for sending emails via {@link https://www.notifications.service.gov.uk }. This service has been registered by {@link createServer}
   */
  logger: HapiServer["logger"];
  constructor(server: HapiServer) {
    this.logger = server.logger;
  }

  parsePersonalisations(options: Personalisation): Personalisation {
    const entriesWithReplacedBools = Object.entries(options).map(
      ([key, value]) => {
        if (typeof value === "boolean") {
          return [key, value ? "yes" : "no"];
        }
        return [key, value];
      }
    );

    return Object.fromEntries(entriesWithReplacedBools);
  }

  sendNotification(args: SendNotificationArgs) {
    const { templateId, emailAddress, personalisation, reference } = args;
    let { apiKey } = args;

    if (isMultipleApiKey(apiKey)) {
      apiKey = (config.apiEnv === "production"
        ? apiKey.production ?? apiKey.test
        : apiKey.test ?? apiKey.production) as string;
    }

    const parsedOptions: SendEmailOptions = {
      personalisation: this.parsePersonalisations(personalisation),
      reference,
    };

    const notifyClient: any = new NotifyClient(apiKey);

    try {
      notifyClient
        .sendEmail(templateId, emailAddress, parsedOptions)
        .then(() => {
          this.logger.info(
            ["NotifyService", "sendNotification"],
            "Email sent successfully"
          );
        });
    } catch (error: any) {
      this.logger.error(
        ["NotifyService", "sendNotification"],
        `Error processing output: ${error.message}`
      );
    }
  }
}
