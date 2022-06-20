import { TopdeskOutputConfiguration } from "@xgovformbuilder/model/src";
import btoa from "btoa";
import fetch from "node-fetch";

interface topdeskTemplate {
  id: string;
  number: string;
  briefDescription: string;
  activities?: string[];
}

export const topdeskTemplates: topdeskTemplate[] = [
  {
    id: "c87ec50d-bf8d-4cd2-8ca2-13587b7467dc",
    number: "CT-101",
    briefDescription: "New Mailbox Request",
  },
  {
    id: "75584b36-66ef-455e-a4cd-97a47b1bffc5",
    number: "CT-098",
    briefDescription: "CCC & TDC New Google Group (Starter)",
  },
  {
    id: "2598178c-2fef-4fec-bdac-831071c20554",
    number: "CT-094",
    briefDescription: "Database Migration",
  },
  {
    id: "432eb6ac-b1fe-4837-a2c3-4281dd53ad03",
    number: "CT-093",
    briefDescription: "EOI",
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
  },
  {
    id: "13c5f1ee-6c5d-47a7-b263-ff04115b46d5",
    number: "CT-090",
    briefDescription: "New Starter - DDC",
  },
  {
    id: "9be204e1-b74d-447d-9b9c-24c1415f93ee",
    number: "CT-082",
    briefDescription: "Leaver Pending",
  },
  {
    id: "a58cbaa0-861e-4aa5-bd89-33b63a4caffd",
    number: "CT-079",
    briefDescription: "New Starter - TDC",
  },
  {
    id: "b5ef61db-c140-4ae0-bd8d-cbf16466e0ad",
    number: "CT-076",
    briefDescription: "TDC - Non Standard SW Request",
  },
  {
    id: "fe8a39e2-f52a-4102-92c1-e11b7df5e533",
    number: "CT-074",
    briefDescription: "TDC New Starter & Equipment Request",
  },
  {
    id: "7e4b709a-de16-477c-ab8d-0cd50a2f18d0",
    number: "CT-073",
    briefDescription: "User Name Change",
  },
  {
    id: "94836fa7-9210-4a38-81d7-0dad893e28fa",
    number: "CT-072",
    briefDescription: "DDC - New Hardware Request",
  },
  {
    id: "4cc9e61d-d2aa-4f7b-8cee-c3332444b988",
    number: "CT-067",
    briefDescription: "Switch to new SSL certificate -",
  },
  {
    id: "65a2dbf7-d591-4af4-bc31-20dbc7fd9378",
    number: "CT-062",
    briefDescription: "Google Password Reset",
  },
  {
    id: "6af4a25e-0b78-41f8-b880-758b6319af4f",
    number: "CT-060",
    briefDescription: "TDC - Non Standard Item Request",
  },
  {
    id: "f8d2844a-d5fd-4ddd-8f13-0a7194e4aa17",
    number: "CT-057",
    briefDescription: "CCC - New Hardware Request",
  },
  {
    id: "fa306d77-7c2f-4165-b84d-42499ec1213e",
    number: "CT-045",
    briefDescription: "SNN Change Request",
  },
  {
    id: "c05b1295-098c-4b12-9b6f-6a1103e7889b",
    number: "CT-044",
    briefDescription: "---Civica Request---",
  },
  {
    id: "949b7f9c-98bb-4d46-b435-68f8dfdfeaf8",
    number: "CT-043",
    briefDescription: "Publish server to the Internet / new public IP",
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
  },
  {
    id: "11baa200-1725-447a-92f3-f0865e72c3e1",
    number: "CT-026",
    briefDescription: "EKDS Account Unlock",
  },
  {
    id: "2cbe513f-e2db-4f61-ae07-142520d16206",
    number: "CT-027",
    briefDescription: "iPad Reconfigure",
  },
  {
    id: "45b83c6a-6b84-4dfb-a24b-6901bc6f38a1",
    number: "CT-025",
    briefDescription: "EKDS Password Reset",
  },
  {
    id: "64923fd7-8f04-495a-8bbe-69656e96ec75",
    number: "CT-022",
    briefDescription: "Hardware Reassignment",
  },
  {
    id: "b8deb61a-655f-49fc-a360-0d3897b3bb1d",
    number: "CT-020",
    briefDescription: "GIS Software Install",
  },
  {
    id: "e54fa42f-a020-4135-a88a-d27209bd12a7",
    number: "CT-019",
    briefDescription: "New Server Request (not used)",
  },
  {
    id: "e8387bd0-6444-4628-9d1f-43ef59a68d78",
    number: "CT-017",
    briefDescription: "Lost\\Stolen Device",
  },
  {
    id: "60ec34a5-3c00-414a-bd25-0ad0a5e46a99",
    number: "CT-015",
    briefDescription: "LLPG Change Request",
  },
  {
    id: "794c8d42-da2e-4592-8b40-3e42f9a2c290",
    number: "CT-007",
    briefDescription: "Leaver",
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
  },
  {
    id: "5dd87b53-b6ca-4ffd-952e-441cfda8788e",
    number: "CT-002",
    briefDescription: "Allow Website",
  },
  {
    id: "8e4983af-50a5-40ab-826e-969098e02bae",
    number: "CT-001",
    briefDescription: "Software Install",
  },
];

export const topdesk = (
  config: TopdeskOutputConfiguration,
  formValues
): Promise<string> => {
  return new Promise((resolve, reject) => {
    formValues = Object.keys(formValues).reduce((acc, pageValues) => {
      return {
        ...acc,
        ...formValues[pageValues],
      };
    }, {});
    if (
      config.username &&
      config.password &&
      config.endpoint &&
      formValues.email &&
      formValues.request &&
      formValues.description
    ) {
      const credentials = btoa(`${config.username}:${config.password}`);
      console.log("doing topdesk action now");
      fetch(`${config.endpoint}/persons?query=email==${formValues.email}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res && res.length > 0) {
            const { id, email } = res[0];

            const requestParams = {
              requester: {
                id,
                identifier: email,
              },
              briefDescription: formValues.request,
              request: formValues.description,
              action: "",
              changeType: "simple",
            };

            console.log("request params: ", requestParams);

            fetch(`${config.endpoint}/operatorChanges`, {
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
