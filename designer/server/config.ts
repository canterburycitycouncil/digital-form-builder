import dotenv from "dotenv";
import joi from "joi";

dotenv.config({ path: ".env" });

export interface Config {
  env: "development" | "test" | "production";
  port: number;
  previewUrl: string;
  publishUrl: string;
  persistentBackend: "s3" | "blob" | "preview" | "dynamoDB";
  s3Bucket?: string;
  dynamoDBTable?: string;
  awsAccessKeyId?: string;
  awsSecretKey?: string;
  awsRegion?: string;
  awsApiKey?: string;
  persistentKeyId?: string;
  persistentAccessKey?: string;
  logLevel: "trace" | "info" | "debug" | "error";
  phase?: "alpha" | "beta";
  footerText?: string;
  isProd: boolean;
  isDev: boolean;
  isTest: boolean;
  lastCommit: string;
  lastTag: string;
  sessionTimeout: number;
  sessionCookiePassword: string;
  topdeskUrl?: string;
  topdeskUsername?: string;
  topdeskPassword?: string;
}

// server-side storage expiration - defaults to 20 minutes
const sessionSTimeoutInMilliseconds = 20 * 60 * 1000;

// Define config schema
const schema = joi.object({
  port: joi.number().default(3000),
  env: joi
    .string()
    .valid("development", "test", "production")
    .default("development"),
  previewUrl: joi.string(),
  publishUrl: joi.string(),
  persistentBackend: joi
    .string()
    .valid("s3", "blob", "preview", "dynamoDB")
    .optional(),
  s3Bucket: joi.string().optional(),
  dynamoDBTable: joi.string().optional(),
  awsAccessKeyId: joi.string().optional(),
  awsSecretKey: joi.string().optional(),
  awsRegion: joi.string().optional(),
  awsApiKey: joi.string().optional(),
  persistentKeyId: joi.string().optional(),
  persistentAccessKey: joi.string().optional(),
  logLevel: joi
    .string()
    .valid("trace", "info", "debug", "error")
    .default("debug"),
  phase: joi.string().valid("alpha", "beta").optional(),
  footerText: joi.string().optional(),
  lastCommit: joi.string().default("undefined"),
  lastTag: joi.string().default("undefined"),
  sessionTimeout: joi.number().default(sessionSTimeoutInMilliseconds),
  sessionCookiePassword: joi.string().optional(),
  topdeskUrl: joi.string().optional(),
  topdeskUsername: joi.string().optional(),
  topdeskPassword: joi.string().optional(),
});

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  previewUrl: process.env.PREVIEW_URL || "http://localhost:3009",
  publishUrl: process.env.PUBLISH_URL || "http://localhost:3009",
  persistentBackend: process.env.PERSISTENT_BACKEND,
  persistentKeyId: process.env.PERSISTENT_KEY_ID,
  persistentAccessKey: process.env.PERSISTENT_ACCESS_KEY,
  s3Bucket: process.env.S3_BUCKET,
  dynamoDBTable: process.env.DYNAMO_DB_TABLE,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_KEY,
  awsRegion: process.env.AWS_REGION,
  awsApiKey: process.env.AWS_API_KEY || "",
  logLevel: process.env.LOG_LEVEL || "error",
  phase: process.env.PHASE || "alpha",
  footerText: process.env.FOOTER_TEXT,
  lastCommit: process.env.LAST_COMMIT || process.env.LAST_COMMIT_GH,
  lastTag: process.env.LAST_TAG || process.env.LAST_TAG_GH,
  sessionTimeout: process.env.SESSION_TIMEOUT,
  sessionCookiePassword: process.env.SESSION_COOKIE_PASSWORD,
  topdeskUrl: process.env.TOPDESK_URL,
  topdeskUsername: process.env.TOPDESK_USERNAME,
  topdeskPassword: process.env.TOPDESK_PASSWORD,
};

// Validate config
const result = schema.validate(config, { abortEarly: false });

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`);
}

// Use the joi validated value
const value: Config = result.value;

value.isProd = value.env === "production";
value.isDev = !value.isProd;
value.isTest = value.env === "test";

export default value;
