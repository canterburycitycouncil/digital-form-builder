# Server persistence services

In order to store form schemes and to perform CRUD operations on them, the server uses a persistence service. The persistence service used is dependent on the persistence service you have set in your environment variables (for more information, go to the [server config section.](/digital-form-builder/designer/server/config.html)). By default the preview persistence service is used.

## Preview persistence service

The preview persistence service is teh default persistence service used by the designer. What this persistence service does is save form schemes to json files in the runner project. This service is meant to be used if the runner is being used for the frontend. The runner then uses the saved form schemes to build forms to be used by users on the frontend.

## S3 persistence service

The S3 persistence service is similar to the preview persistence service, the key difference being that the json files are being saved to an S3 bucket instead of a folder in the runner service. This service is also compatible with the runner service.

Important variables to set for this service are:

- s3Bucket - the s3 bucket to upload the form schemes to

## DynamoDB persistence service

The DynamoDB persistence service uses the aws sdk to save form schemes to a DynamoDB table. This service is not compatibkle with the runner service out of the box, however as long as the aws sdk is enabled and you have an access key with access to the specified table, any frontend should be able to use the form schemes.

Important variables to set for this service are:

- awsSecretKey - the secret key for the user with programmatic access
- awsAccessKeyId - the acxess key id for the user with programmatic access
- awsRegion - the region the dynamodb table is held in
- dynamoDBTable - the table name to store form schemes in
