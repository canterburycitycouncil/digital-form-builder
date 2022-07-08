import { FormConfiguration, Logger } from "@xgovformbuilder/model";
import S3 from "aws-sdk/clients/s3";

import config from "../../config";
import { PersistenceService } from "./persistenceService";

const TYPE_METADATA_KEY = "x-amz-meta-type";

const FEEDBACK_TYPE = "feedback";

const DISPLAY_NAME_METADATA_KEY = "x-amz-meta-name";

export class S3PersistenceService implements PersistenceService {
  logger: any;
  bucket: any;

  constructor(server: any) {
    this.logger = new Logger(server, "S3PersistenceService");
    this.bucket = new S3({
      region: "eu-west-2",
      params: { Bucket: config.s3Bucket },
    });
  }

  async listAllConfigurations() {
    const response = await this.bucket.listObjects().promise();
    if (response.error) {
      this.logger.error(
        `error listing all configurations ${response.error.message}`
      );
      return response.error;
    }
    return response.Contents.map((entry) => {
      const metadata = entry.Metadata ?? {};
      return new FormConfiguration(
        entry.Key.replace(".json", ""),
        metadata[DISPLAY_NAME_METADATA_KEY],
        entry.LastModified,
        metadata[TYPE_METADATA_KEY] === FEEDBACK_TYPE
      );
    });
  }

  async getConfiguration(id: string) {
    const response = await this.bucket
      .getObject({ Key: `${this._ensureJsonExtension(id)}` })
      .promise();
    if (response.error) {
      this.logger.error(
        `error getting configuration with id: ${id}, ${response.error.message}`
      );
      return response.error;
    } else {
      return Buffer.from(response.Body).toString("utf-8");
    }
  }

  async uploadConfiguration(id: string, configuration: string) {
    id = this._ensureJsonExtension(id);
    const metadata = this._createMetadata(configuration);
    const response = await this.bucket
      .upload({ Key: id, Body: configuration, Metadata: metadata })
      .promise();
    if (response.error) {
      this.logger.error(
        `error uploading configuration with id: ${id} ${response.error.message}`
      );
    }
    return response;
  }

  async copyConfiguration(configurationId: string, newName: string) {
    configurationId = this._ensureJsonExtension(configurationId);
    const response = await this.bucket
      .copyObject({
        CopySource: encodeURI(
          `${this.bucket.config.params.Bucket}/${configurationId}`
        ),
        Key: this._ensureJsonExtension(newName),
      })
      .promise();
    if (response.error) {
      this.logger.error(
        `error copying configuration with id: ${configurationId}, with new name ${newName}, ${response.error.message}`
      );
    }
    return response;
  }

  async deleteConfiguration(configurationId: string): Promise<any> {
    configurationId = this._ensureJsonExtension(configurationId);
    const response = await this.bucket
      .deleteObject({
        Key: configurationId,
      })
      .promise();
    if (response.error) {
      this.logger.error(
        `error deleting configuration with id: ${configurationId}, ${response.error.message}`
      );
    }
  }

  _createMetadata(configuration: string) {
    const parsedConfiguration = JSON.parse(configuration);
    const metadata = {};
    if (parsedConfiguration.name) {
      metadata[DISPLAY_NAME_METADATA_KEY] = parsedConfiguration.name;
    }
    if (parsedConfiguration.feedback?.feedbackForm) {
      metadata[TYPE_METADATA_KEY] = FEEDBACK_TYPE;
    }
    return metadata;
  }

  _ensureJsonExtension(configurationId: string) {
    if (!configurationId.endsWith(".json")) {
      configurationId = `${configurationId}.json`;
    }
    return configurationId;
  }
}
