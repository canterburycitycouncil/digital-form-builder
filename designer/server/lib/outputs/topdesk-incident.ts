import {
  ComponentDef,
  FormDefinition,
  TopdeskOutputConfiguration,
} from "@xgovformbuilder/model/src";
import btoa from "btoa";
import FormData from "form-data";
import fetch from "node-fetch";

import { FileUpload } from "./s3fileupload";

interface blankObject {
  [key: string]: any;
}

export const topdeskIncident = (
  outputConfig: TopdeskOutputConfiguration,
  formValues,
  formScheme: FormDefinition,
  files: FileUpload[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let config = {
      topdeskUrl: "https://eks.topdesk.net/tas/api",
      topdeskUsername: "CCC.API",
      topdeskPassword: "5yd5s-d3myr-2r6mf-zpeus-z4rkt",
    };
    formValues = Object.keys(formValues).reduce((acc, pageValues) => {
      return {
        ...acc,
        ...formValues[pageValues],
      };
    }, {});
    const fields = formScheme.pages.reduce<ComponentDef[]>(
      (acc, currentPage) => {
        if (currentPage.components) {
          return [...acc, ...currentPage.components];
        } else {
          return [...acc];
        }
      },
      []
    );
    if (config.topdeskUrl && config.topdeskUsername && config.topdeskPassword) {
      const credentials = btoa(
        `${config.topdeskUsername}:${config.topdeskPassword}`
      );
      console.log("doing topdesk action now");
      fetch(
        `${config.topdeskUrl}/persons?query=email==${
          formValues[outputConfig.email]
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.length > 0) {
            const { id, email } = res[0];
            let requestParams: blankObject = {
              caller: {
                id,
                email,
              },
              status: "firstLine",
            };

            requestParams.briefDescription = outputConfig.briefDescription
              ? formValues[outputConfig.briefDescription]
                  .split(" ")
                  .slice(0, 9)
                  .join(" ")
              : "";

            let requestString = `${Object.keys(formValues).map((fieldName) => {
              let fieldDef = fields.find((field) => field.name === fieldName);
              if (fieldDef) {
                return `${fieldDef.title}: ${
                  typeof formValues[fieldName] === "object"
                    ? JSON.stringify(formValues[fieldName])
                    : formValues[fieldName]
                }<br>`;
              } else {
                return "";
              }
            })}`;

            requestParams.request = requestString;

            console.log("request params: ", requestParams);

            fetch(`${config.topdeskUrl}/incidents`, {
              method: "POST",
              body: JSON.stringify(requestParams),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials}`,
              },
            })
              .then((res) => {
                return res.json();
              })
              .then((res) => {
                if (res.id) {
                  console.log("created the ticket: ", res);
                  const fileUrl = `${config.topdeskUrl}/incidents/id/${res.id}/attachments`;
                  let fileResponses: Promise<any>[] = [];
                  files.forEach((file) => {
                    fileResponses.push(
                      new Promise((resolve, reject) => {
                        let fileFormData = new FormData();
                        fileFormData.append(
                          "file",
                          file.fileContent.toString()
                        );
                        fileFormData.append("invisibleForCall", "false");
                        fileFormData.append(
                          "description",
                          "supporting attachment"
                        );
                        try {
                          fetch(fileUrl, {
                            method: "POST",
                            body: fileFormData,
                            headers: {
                              Authorization: `Basic ${credentials}`,
                            },
                          })
                            .then((res) => res.json())
                            .then((res) => {
                              resolve(res);
                            })
                            .catch((err) => resolve(err));
                        } catch (err) {
                          reject(err);
                        }
                      })
                    );
                  });
                  Promise.all(fileResponses)
                    .then((res) => {
                      resolve(res[0]);
                    })
                    .catch((err) => {
                      console.log(err);
                      resolve(err);
                    });
                } else {
                  reject(res);
                }
              })
              .catch((err) => {
                reject(err);
              });
          }
        });
    } else {
      console.log("values missing: ", config, formValues);
      reject("There were some values missing from the submitted form");
    }
  });
};
