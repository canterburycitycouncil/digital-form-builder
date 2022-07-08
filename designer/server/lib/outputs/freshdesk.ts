import { FreshdeskOutputConfiguration } from "@xgovformbuilder/model";
// import fetch from 'node-fetch';

export const freshdesk = async (
  _config: FreshdeskOutputConfiguration,
  _submission,
  _formValues
): Promise<string> => {
  return new Promise((resolve) => {
    resolve("hello");
    // try {
    //   const endpointUrl =
    //     "https://bxz1wuvcx5.execute-api.eu-west-2.amazonaws.com/alpha/ticket";
    //   let formPages = Object.keys(formValues);
    //   let flattenedFormValues = formPages.reduce((acc, currentPage) => {
    //     let pageValues = formValues[currentPage];
    //     acc = {
    //       ...acc,
    //       ...pageValues,
    //     };
    //     return acc;
    //   }, {}) as any;
    //   let postBody = {
    //     formValues: {
    //       ticket_type: submission.formId,
    //       first_name: flattenedFormValues.first_name,
    //       surname: flattenedFormValues.surname,
    //       email: flattenedFormValues.email,
    //       telephone: flattenedFormValues.telephone
    //         ? flattenedFormValues.telephone
    //         : "",
    //       address: flattenedFormValues.address
    //         ? flattenedFormValues.address
    //         : "",
    //       custom_fields: {
    //         cf_submission_id: submission.submissionId,
    //       },
    //     },
    //   };
    //   fetch(endpointUrl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Api-Key": config.apiKey,
    //     },
    //     body: JSON.stringify(postBody),
    //   })
    //     .then((res) => res.json())
    //     .then((ticketRes) => {
    //       resolve(ticketRes);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       reject(err);
    //     });
    // } catch (err) {
    //   reject(err);
    // }
  });
};
