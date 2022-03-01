import { S3FileUploadOutputConfiguration } from "@xgovformbuilder/model";
const fetch = require("node-fetch");

async function getPresignedUploadUrl(config, file: any) {
  const presignedUrl = await fetch(`${config.endpoint}?filetype=${file.type}`, {
    headers: {
      "X-Api-Key": config.apiKey,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error, error.stack);
    });

  return presignedUrl;
}

async function readFile(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => reject();
    reader.onerror = () => reject();
    reader.onload = () => resolve(reader.result);

    reader.readAsArrayBuffer(file);
  });
}

async function uploadFile(config, file: any) {
  const [{ uploadUrl }, data]: any = await Promise.all([
    getPresignedUploadUrl(config, file),
    readFile(file),
  ]);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (res.ok) {
    console.log("Successfully uploaded");
  } else {
    console.log("ERROR");
    console.log(res);
  }
}

export const s3fileupload = async (
  config: S3FileUploadOutputConfiguration,
  formScheme,
  submission
): Promise<string> => {
  let fileFieldNames = formScheme.pages.reduce((acc, page) => {
    let fileComponents = page.components.filter(
      (component) => component.type === "FileUploadField"
    );
    return acc.concat(fileComponents);
  }, []);

  let submissionValues = Object.keys(submission.formValues).reduce(
    (acc, page) => {
      return { ...acc, ...submission.formValues[page] };
    },
    {}
  );

  let fileValues = Object.keys(submissionValues).map((property) => {
    if (
      fileFieldNames.findIndex((component) => component.name === property) > -1
    ) {
      return submissionValues[property];
    } else {
      return null;
    }
  });

  console.log(submissionValues);

  console.log(fileValues);

  return await getPresignedUploadUrl(config, submission);

  // const fileType = submission.fileType; // TODO

  // const presignedUrl = await fetch(
  //   `${config.endpoint}?filetype=${fileType}`, {
  //     'headers': {
  //       'X-Api-Key': config.apiKey,
  //     }
  //   }
  // ).then((res) => res.json())
  // .catch((error) => {
  //   console.log(error, error.stack);
  // });
};
