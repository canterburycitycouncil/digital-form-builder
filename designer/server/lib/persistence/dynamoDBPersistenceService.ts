import * as AWS from "aws-sdk";
import config from "../../config";
import { PersistenceService } from "./persistenceService";
import { Logger, FormConfiguration } from "@xgovformbuilder/model";
import { ConfigurationOptions } from "aws-sdk/lib/config-base";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const awsConfig: ConfigurationOptions = {
  region: "eu-west-2",
  secretAccessKey: config.awsSecretKey,
  accessKeyId: config.awsAccessKeyId,
};

export class dynamoDBPersistenceService implements PersistenceService {
  logger: any;
  client: DocumentClient;

  constructor(server: any) {
    this.logger = new Logger(server, "dynamoDBPersistenceService");
    AWS.config.update(awsConfig);
    this.client = new AWS.DynamoDB.DocumentClient({ region: config.awsRegion });
  }

  async listAllConfigurations(): Promise<FormConfiguration[]> {
    return new Promise(async (resolve, reject) => {
      if (!config.dynamoDBTable) {
        this.logger.error(
          `No table name was supplied. To use the Dynamo DB service, you must supply the table name the forms will be built to.`
        );
      } else {
        try {
          await this.client
            .scan({ TableName: config.dynamoDBTable })
            .send((err, data) => {
              if (err) {
                reject(err);
              }
              resolve(
                data.Items
                  ? data.Items.map((item) => {
                      return new FormConfiguration(item.id, item.name);
                    })
                  : []
              );
            });
        } catch (err) {
          reject(err);
        }
      }
    });
  }

  async getConfiguration(id: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!config.dynamoDBTable) {
        this.logger.error(
          `No table name was supplied. To use the Dynamo DB service, you must supply the table name the forms will be built to.`
        );
        reject(
          `No table name was supplied. To use the Dynamo DB service, you must supply the table name the forms will be built to.`
        );
      } else {
        try {
          const params = {
            TableName: config.dynamoDBTable,
            Key: {
              id: id,
            },
          };
          await this.client.get(params).send((err, data) => {
            if (err) {
              reject(err);
            }
            if (data && data.Item) {
              resolve(JSON.stringify(data.Item));
            } else {
              return resolve("");
            }
          });
        } catch (err) {
          reject(err);
        }
      }
    });
  }

  async uploadConfiguration(id: string, configuration: string) {
    id = id.replace(".json", "");
    let form = JSON.parse(configuration);
    form.formId = id;
    form.createdAt = this.formatAWSDate(new Date());
    form.updatedAt = this.formatAWSDate(new Date());
    form.pages = form.pages;
    form.outputs = form.outputs;
    form.logicExpressions = form.logicExpressions;
    if (!config.dynamoDBTable) {
      this.logger.error(
        `no name for dynamoDBTable was defined. Make sure this is set in your .env file.`
      );
    } else {
      if (!form.totalSubs) {
        form.totalSubs = 0;
      }
      try {
        await this.client
          .put({
            TableName: config.dynamoDBTable,
            Item: {
              id: id,
              ...form,
            },
          })
          .send((err, res) => {
            if (err) {
              this.logger.error(
                `error uploading configuration with id: ${id} ${err.message}`
              );
            }
            this.logger.debug(res);
            return res;
          });
      } catch (err) {
        this.logger.error(
          `error uploading configuration with id: ${id} ${
            (err as Error).message
          }`
        );
      }
    }
  }

  async copyConfiguration(configurationId: string, newName: string) {
    const configuration = await this.getConfiguration(configurationId);
    return this.uploadConfiguration(newName, JSON.parse(configuration).values);
  }

  async deleteConfiguration(configurationId: string) {
    return new Promise(async (resolve, reject) => {
      let params = {
        TableName: config.dynamoDBTable,
        Key: {
          id: configurationId,
        },
      };
      try {
        await this.client.delete(params).send((err, data) => {
          if (err) {
            reject(err);
          }
          resolve("");
        });
      } catch (err) {
        this.logger.error(
          `error deleting configuration with id: ${configurationId} ${
            (err as Error).message
          }`
        );
      }
    });
  }

  formatAWSDate(date: Date) {
    return `${date.getFullYear()}-${this.getValidString(
      date.getMonth()
    )}-${this.getValidString(date.getDate())}T${this.getValidString(
      date.getHours()
    )}:${this.getValidString(date.getMinutes())}:${this.getValidString(
      date.getSeconds()
    )}.${
      date.getMilliseconds() >= 100
        ? date.getMilliseconds()
        : "0" + this.getValidString(date.getMilliseconds())
    }Z`;
  }

  getValidString(value: number) {
    return value >= 10 ? value.toString() : "0" + value;
  }
}
