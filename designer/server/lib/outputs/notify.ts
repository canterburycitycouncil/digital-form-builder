import { Submission } from "@xgovformbuilder/designer/client/pages/Submissions/types";
import {
  FormDefinition,
  NotifyOutputConfiguration,
} from "@xgovFormBuilder/model/src";
import { NotifyClient } from "notifications-node-client";

interface NotifyItemValue {
  item: string;
  value: string;
}

interface PreviousValues {
  [key: string]: {
    [key: string]: any;
  };
}

const formSchemeKeys = ["formId"];

const submissionKeys = ["submissionId"];

const systemKeys = [...formSchemeKeys, ...submissionKeys];

export const GOVNotifySendEmail = (
  submission: Submission,
  formScheme: FormDefinition,
  configuration: NotifyOutputConfiguration,
  previousValues?: PreviousValues
): Promise<{ emailUri: string } | string> => {
  return new Promise((resolve) => {
    let flattenedFormValues = Object.keys(submission.formValues).reduce(
      (acc, currentPage) => ({
        ...acc,
        ...submission.formValues[currentPage],
      }),
      {}
    );
    let notifyClient = new NotifyClient(configuration.apiKey);
    let systemValues = systemKeys.reduce(
      (acc, currentKey) => ({
        ...acc,
        [currentKey]: formSchemeKeys.includes(currentKey)
          ? formScheme[currentKey]
          : submissionKeys.includes(currentKey)
          ? submission[currentKey]
          : "unknown",
      }),
      {}
    );
    if (configuration.emailField.indexOf(".") > -1) {
      let splitEmailField = configuration.emailField.split(".");
      configuration.emailField = splitEmailField[splitEmailField.length - 1];
    }
    notifyClient
      .sendEmail(
        configuration.templateId,
        flattenedFormValues[configuration.emailField],
        {
          personalisation: getValuesForPersonalisation(
            configuration.personalisation,
            flattenedFormValues,
            systemValues,
            previousValues
          ),
          reference: "",
        }
      )
      .then((res) => {
        if (res.data) {
          resolve({
            emailUri: res.data.uri,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        resolve(err);
      });
  });
};

const getValuesForPersonalisation = (
  personalisation: NotifyItemValue[],
  flattenedFormValues,
  systemValues,
  previousValues?
) => {
  personalisation = personalisation.map((item) => {
    let value;
    let splitValue = item.item.split(".");
    if (splitValue[0] === "output") {
      if (
        previousValues &&
        previousValues[splitValue[1]] &&
        previousValues[splitValue[1]][splitValue[2]]
      ) {
        value = previousValues[splitValue[1]][splitValue[2]];
      } else {
        value = "unknown";
      }
    } else if (systemKeys.includes(splitValue[0])) {
      value = systemValues[splitValue[0]];
    } else if (
      (splitValue.length === 1 && flattenedFormValues[splitValue[0]]) ||
      (splitValue.length === 2 && flattenedFormValues[splitValue[1]])
    ) {
      value =
        splitValue.length === 1
          ? flattenedFormValues[splitValue[0]]
          : flattenedFormValues[splitValue[1]];
    } else {
      value = "unknown";
    }
    return {
      item: item.value,
      value: value,
    };
  });
  return personalisation.reduce(
    (acc, currentItem) => ({
      ...acc,
      [currentItem.item]: currentItem.value,
    }),
    {}
  );
};
