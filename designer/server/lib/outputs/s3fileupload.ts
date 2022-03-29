import { S3FileUploadOutputConfiguration } from "@xgovformbuilder/model";
const fetch = require("node-fetch");

async function getPresignedUploadUrl(
  config,
  file: FileUpload,
  submission: any
) {
  const presignedUrl = await fetch(
    `${config.endpoint}?filetype=${
      file.type
    }&filename=${file.filename.substring(
      0,
      file.filename.indexOf(".")
    )}&submission_id=${submission.submissionId}`,
    {
      headers: {
        "X-Api-Key": config.apiKey,
      },
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log(error, error.stack);
    });

  return presignedUrl;
}

async function uploadFile(
  uploadUrl,
  file: FileUpload
): Promise<FailedUploadResponse | PassedUploadResponse> {
  return new Promise((resolve, reject) => {
    fetch(uploadUrl, {
      method: "PUT",
      body: file.fileContent,
      headers: {
        "Content-Type": file.type,
      },
    })
      .then((res) => {
        if (res.ok) {
          resolve({
            ok: true,
            url: res.url.substring(0, res.url.indexOf("?")),
            filename: file.filename,
          });
        } else {
          console.log("ERROR");
          console.log(res);
          reject({ filename: file.filename, error: res });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const replaceSubmissionValueWithUrl = (
  submission: any,
  filename: string,
  url: string
): any => {
  Object.keys(submission.formValues).forEach((page) => {
    Object.keys(submission.formValues[page]).forEach((field) => {
      if (submission.formValues[page][field] === filename) {
        submission.formValues[page][field] = url;
      }
    });
  });
  return submission;
};

export interface FileUpload {
  filename: string;
  type: string;
  fileContent: Buffer;
}

interface UploadResponse {
  ok: boolean;
}

interface FailedUploadResponse extends UploadResponse {
  ok: false;
  filename: string;
  error: Error;
}

interface PassedUploadResponse extends UploadResponse {
  ok: true;
  url: string;
  filename: string;
}

export interface FileResponse {
  totalFiles: number;
  uploadedFiles?: string[];
  failedFiles?: FailedFileResponse[];
  message?: string;
}

interface FailedFileResponse {
  filename: string;
  error: Error;
}

export const s3fileupload = async (
  config: S3FileUploadOutputConfiguration,
  submission,
  files: FileUpload[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let filePromises: Promise<
      FailedUploadResponse | PassedUploadResponse
    >[] = [];
    try {
      files.forEach((file) => {
        filePromises.push(
          new Promise(async (resolve, reject) => {
            try {
              const { uploadUrl } = await getPresignedUploadUrl(
                config,
                file,
                submission
              );
              uploadFile(uploadUrl, file)
                .then((res) => {
                  resolve(res);
                })
                .catch((err) => {
                  console.log("looks like there was an error");
                  console.log(err);
                  resolve({ ok: false, error: err, filename: file.filename });
                });
            } catch (err) {
              reject(err);
            }
          })
        );
      });
      Promise.all(filePromises)
        .then((res) => {
          let fileResponse: FileResponse = {
            totalFiles: 0,
          };
          res.forEach((response) => {
            fileResponse.totalFiles++;
            if (response.ok) {
              if (!fileResponse.uploadedFiles) {
                fileResponse.uploadedFiles = [];
              }
              fileResponse.uploadedFiles.push(response.url);
              submission = replaceSubmissionValueWithUrl(
                submission,
                response.filename,
                response.url
              );
            } else {
              if (!fileResponse.failedFiles) {
                fileResponse.failedFiles = [];
              }
              fileResponse.failedFiles.push({
                filename: response.filename,
                error: response.error,
              });
            }
          });
          if (fileResponse.uploadedFiles && !fileResponse.failedFiles) {
            fileResponse.message = "All files uploaded successfully";
          } else if (fileResponse.uploadedFiles && fileResponse.failedFiles) {
            fileResponse.message =
              "Some files were uploaded successfuly but there were some errors";
          } else {
            fileResponse.message = "No files were uploaded successfully.";
          }
          resolve({ submission: submission });
        })
        .catch((err) => {
          console.log("error with the file promises");
          console.log(err);
          resolve(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};
