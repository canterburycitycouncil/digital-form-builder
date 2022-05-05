# server outputs

Server outputs are operations which run on form submission which either modify the form submission or push information from the submission into back office systems. As the form builder develops more outputs will be added, but as it stands only a few are currently available.

## Output structure

Server side, outputs are used in the runOutputs route. The actual functions that are run as part of the output are kept in the designer/server/lib/outputs folder. These outputs are then exported from an index file in this folder, and imported from this folder into the runOutputs route.

## Output run order

there may be cases where certain outputs rely on the result of another output in order to run. In these cases, the first output should have a next property which specifies what the next output to run should be, and the following output should have a previous property as well as a previous values property to specify what values to take from the response of the previous output. Also, in the case of second stage outputs, the second stage outputs will use the updated form submission from when all the first stage outputs run.

## Create freshdesk ticket output

This output creates a ticket in freshdesk. The configuration of this output involves providing a freshdesk host, an api key, and a list of custom fields which can be supplied to the freshdesk ticket. These custom fields need to be given the same name on the form as they have on the freshdesk system for the mapping to work properly.

## S3 File upload

This output takes files that have been uploaded to the form and uploads them to S3. After uploading the files to S3, the values of the file upload field in the submission are updated with the url in S3. The configuration for this output involves an endpoint to recive a presigned url from (typically an api gateway rest endpoint) and an optional api key to be supplied to the specified endpoint.

## Webhook output

This output will push the entire form submission to the specified webhook. This will be useful for systems where the webhook will do most of the heavy lifting. The only configuration option for this output is the url of the webhook to send the form submission to.
