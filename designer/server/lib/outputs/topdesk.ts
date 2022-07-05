import {
  ComponentDef,
  FormDefinition,
  TopdeskOutputConfiguration,
} from "@xgovformbuilder/model/src";
import btoa from "btoa";
import fetch from "node-fetch";

// import config from "../../config";

interface topdeskTemplate {
  id: string;
  number: string;
  briefDescription: string;
  activities?: string[];
  category?: string;
  subCategory?: string;
  action?: string;
}

interface blankObject {
  [key: string]: any;
}

export const topdeskTemplates: topdeskTemplate[] = [
  {
    id: "c87ec50d-bf8d-4cd2-8ca2-13587b7467dc",
    number: "CT-101",
    briefDescription: "New Mailbox Request",
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "75584b36-66ef-455e-a4cd-97a47b1bffc5",
    number: "CT-098",
    briefDescription: "CCC & TDC New Google Group (Starter)",
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "2598178c-2fef-4fec-bdac-831071c20554",
    number: "CT-094",
    briefDescription: "Database Migration",
    category: "Corporate Software",
  },
  {
    id: "432eb6ac-b1fe-4837-a2c3-4281dd53ad03",
    number: "CT-093",
    briefDescription: "EOI",
    category: "EOI",
    subCategory: "EOI",
  },
  {
    id: "7a82546d-ecc0-477f-b475-11398dce49b2",
    number: "CT-092",
    briefDescription: "CCC New Starter & Equipment Request",
    activities: [
      "TA-001",
      "TA-003",
      "TA-027",
      "TA-037",
      "TA-038",
      "TA-039",
      "TA-068",
      "TA-101",
      "TA-116",
      "TA-121",
      "TA-122",
      "TA-147",
      "TA-161",
      "TA-220",
      "TA-223",
      "TA-224",
    ],
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "9be204e1-b74d-447d-9b9c-24c1415f93ee",
    number: "CT-082",
    briefDescription: "Leaver Pending",
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "7e4b709a-de16-477c-ab8d-0cd50a2f18d0",
    number: "CT-073",
    briefDescription: "User Name Change",
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "4cc9e61d-d2aa-4f7b-8cee-c3332444b988",
    number: "CT-067",
    briefDescription: "Switch to new SSL certificate -",
    category: "Intranets and Corporate Websites",
  },
  {
    id: "f8d2844a-d5fd-4ddd-8f13-0a7194e4aa17",
    number: "CT-057",
    briefDescription: "CCC - New Hardware Request",
    category: "Hardware",
  },
  {
    id: "949b7f9c-98bb-4d46-b435-68f8dfdfeaf8",
    number: "CT-043",
    briefDescription: "Publish server to the Internet / new public IP",
    category: "Infrastructure",
    subCategory: "Firewall",
  },
  {
    id: "cf63d61b-0a29-4fcc-8fe9-da8d9095309f",
    number: "CT-032",
    briefDescription: "New Purchase",
  },
  {
    id: "17b7c8a1-9ff5-4861-a2fd-3044e3b5d72f",
    number: "CT-028",
    briefDescription: "VPN access request (third-party)",
    category: "Remote Connection",
    subCategory: "VPN Access",
  },
  {
    id: "11baa200-1725-447a-92f3-f0865e72c3e1",
    number: "CT-026",
    briefDescription: "EKDS Account Unlock",
    category: "Password Reset",
    subCategory: "Account Unlock",
  },
  {
    id: "2cbe513f-e2db-4f61-ae07-142520d16206",
    number: "CT-027",
    briefDescription: "iPad Reconfigure",
    category: "Hardware",
    subCategory: "Smart Devices",
  },
  {
    id: "45b83c6a-6b84-4dfb-a24b-6901bc6f38a1",
    number: "CT-025",
    briefDescription: "EKDS Password Reset",
    category: "Password Reset",
    subCategory: "AD Password Reset",
  },
  {
    id: "64923fd7-8f04-495a-8bbe-69656e96ec75",
    number: "CT-022",
    briefDescription: "Hardware Reassignment",
    category: "Hardware",
  },
  {
    id: "e8387bd0-6444-4628-9d1f-43ef59a68d78",
    number: "CT-017",
    briefDescription: "Lost\\Stolen Device",
    category: "Hardware",
  },
  {
    id: "794c8d42-da2e-4592-8b40-3e42f9a2c290",
    number: "CT-007",
    briefDescription: "Leaver",
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "5b6d9431-a4d4-42d6-a810-84e0ac5be3a8",
    number: "CT-005",
    briefDescription: "New Starter",
    activities: [
      "TA-001",
      "TA-003",
      "TA-101",
      "TA-121",
      "TA-122",
      "TA-147",
      "TA-161",
      "TA-220",
      "TA-223",
      "TA-224",
    ],
    category: "Operations",
    subCategory: "User Amendment",
  },
  {
    id: "5dd87b53-b6ca-4ffd-952e-441cfda8788e",
    number: "CT-002",
    briefDescription: "Allow Website",
    category: "Infrastructure",
    subCategory: "Webfilter",
    action: "Website(s):\nReason For Access:\nReason It Was Blocked:",
  },
  {
    id: "8e4983af-50a5-40ab-826e-969098e02bae",
    number: "CT-001",
    briefDescription: "Software Install",
    action: "Look at knowledge base for further information",
  },
];

export const topdesk = (
  outputConfig: TopdeskOutputConfiguration,
  formValues,
  formScheme: FormDefinition
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
              requester: {
                id,
                email,
              },
            };

            if (outputConfig.template !== "none") {
              let template = topdeskTemplates.find(
                (template) => template.number === outputConfig.template
              ) as topdeskTemplate;
              requestParams.template = {
                id: template.id,
                number: template.number,
              };
              if (template.activities) {
                requestParams.template.optionalActivities = template.activities;
              }
              if (template.category) {
                requestParams.category = template.category;
              }
              if (template.subCategory) {
                requestParams.subCategory = template.subCategory;
              }
              if (template.action) {
                requestParams.action = template.action;
              }
            } else {
              requestParams.briefDescription = outputConfig.briefDescription
                ? formValues[outputConfig.briefDescription]
                : "";
            }

            let requestString = `${Object.keys(formValues)
              .map((fieldName) => {
                let fieldDef = fields.find((field) => field.name === fieldName);
                if (fieldDef) {
                  return `${fieldDef.title}: ${
                    typeof formValues[fieldName] === "object"
                      ? JSON.stringify(formValues[fieldName])
                      : formValues[fieldName]
                  }\n`;
                } else {
                  return "";
                }
              })
              .join("")}`;

            requestParams.request = requestString;

            console.log("request params: ", requestParams);

            fetch(`${config.topdeskUrl}/operatorChanges`, {
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
                if (res.number) {
                  console.log("created the ticket: ", res);
                  resolve(res);
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
