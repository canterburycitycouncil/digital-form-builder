# Model package

The model package is used for keeping all of the models used in the designer.
Exporting all types and interfaces from one package allows easier imports across the project, as well as making it easier to make changes to types and interfaces.
When multiple components which are kept in different locations use the same types, having them both access these types from the same location also reduces repetitive code. Soem intrefaces and types are still kept in specific components, but in most cases these types are specific and don't require exporting at all.

There are a few different folders where models are kept in this package, separated by the context in which the types are associated.

## Components

the components folder houses all the types and interfaces for form components. In here the default configuration is kept for all different types of fields in forms. There are a few different files contained in this folder which hold different parts of the component models:

### Component-types.ts

This file holds the default configuration for each form component. All components have a few properties:

- name - The default machine name for the field
- type - The type of field
- title - The title to be displayed on the component menu
- subType - The collection of fields this field belongs to. Fields are categorised as content fields or input fields
- hint - the default hint to be shown to the user when completing the field on the frontend
- options - A default object to be supplied for holding different options on the field. example options are whetehr the field is required, internal only or external only, etc
- schema - A default object for holding the schema of the field. Examples of schema properties are the max length of the field, number of rows for text areas, etc.

### conditional-component-types.ts

This file is exactly the same as the component-types file, except specifically for conditional fields.

### types.ts

This file holds the types and interfaces for each form component. These types specify what options and schema properties can be set for each field. Since some fields are quite similar in what options and schema they can use, certain fields extend a base field, in most cases adding a few extra options or changing the type.

## conditions

This directory houses all models and utility functions related to conditions. Conditions are currently unknown to us in how they work, so this part of the documentation will be written up later.

## data-model

This directory houses the type for the FormDefinition, and so by extension every other type that exists on a form. There are also a couple of other files which exist in this directory. The conditions wrapper is used for being able to show the condition visually, and the input wrapper is unused.

With that in mind, here is a breakdown of the form definition.

### types Next and Link

Next is the type used for defining what the next page in the form definition is next. As certain pages may not link directly to the next page in the list of pages, a type needed to be created that specified the path of the next page, as well as the condition associated with it. The Link type is the same as the Next type, except it's used in other places.

### interface Page

Page is the type used to define a page of the form. A Page has the following properties:

- title - The title of the page to be displayed to the user
- path - The path at which this page should be located
- controller - The controller to be used for the Page. Obsolete if using our gatsby frontend, but important when used with the runner
- components - An array of form components belonging to the page. When fields are added to the page, they appear as a ComponentDef in this array
- section - The name of the section this page belongs to. If a section is present, the section name will appear above the page title in the frontend
- next - an array of objects containing the next page to navigate to and what conditions need to be met to navigate to that page

### interface Section

Section is the type assigned to sections on a form. A section is a grouping used for pages, so if multiple pages are related to a section, they will appear as a sub heading of that section. Only two properties exist on a section: the machine name of the section, and the title (or friendly name) for the section.

### interface Item

An Item refers to a list item. An explanation for a list will follow, but the main things to know for a list item are that they have a name, an associated value, an optional description if required, and a condition to show the item if met.

### interface List

A List can be used in multiple places in a form, but will most often be used for checkboxes, radio buttons and select field dropdowns. Lists are held in a separate property on the form, so that if a generic list has been created it can be used across any number of pages. For example, if you want a yes/no field using radio buttons, you can create a yes/no list which has optiosn for yes and no, and then that list can be used across multiple pages without the need to create that field from scratch every time.
The following properties exist on a List:

- name - the machine name of the list
- title - the friendly name to be shown to the user for the list
- type - the type of values to appear in the list.
- items - an array of items that will appear in the list. List items are explained above

### interface LogicExpression

A LogicExpression is a configurable expression that results in a value which can then be used elsewhere in the form. The results of logic expressions are then assigned to variables, which can then be used to populate fields, resolve conditions, or be used in outputs.
For example, let's say you have a form which requires payment from a user. The amount the user has to pay is calculated by multiplying the result of a field by a certain number. You could use a logic expression to do that calculation, then pass the variable to the payment output so that the user can pay that amount.
The following properties exist on a LogicExpression:

- label - The label for the logic expression
- variableName - the name of the variable to be used when adding to a field/output
- expression - a string version of the expression to execute. This string is parsed by the logic expression editor to make it suitable for editing

### interface Feedback

The Feedback interface is used for specifying whether a form has an associated feedback form for users to provide feedback.
The following properties exist on the Feedback interface:

- feedbackForm - a boolean to determine whether there is a feedback form or not
- url - The url of the feedback form to link to
- emailAddress - the email address for the response to be sent to

### interface PhaseBanner

The PhaseBanner interface is used for displaying a banner which shows what phase of development the form is in. Our frontend doesn't use this phase banner, but the properties set are a phase property which is either alpha or beta, and then a feedback url for the feedback form associated with this form.

### interface MultipleApiKeys

Used for govpay output. An api key can be be specified for a test deployment and a production deployment, so depending on the phase of the form the test or production api key can be used.

### enum OutputType

An enumerator for keepign a list of all the different output types available for creating an output. This ensures that only certain output types can be declared.

### interface EmailOutputConfiguration

Configuration for the email output. Sets the email for the form submission to be sent to on form completion.

### interface NotifyOutputConfiguration

Configuration for the GOVnotify output. GOVnotify can be used for creating emails with bespoke templates, where certain data can be sent in the email template. The properties for the configuration are as follows:

- apiKey - the api key for the GOVNotify account being used
- templateId - the id of the email template to use
- emailField - the address to send the email to
- personalisation - An array of strings which specify a value from the form and the placeholder in the templaet to map it to
- addReferencesToPersonalisation - a boolean which when selected will automatically add certain information to the email being sent. These include a webhook reference, a payment reference, and two booleans for whether these are available

### interface WebhookOutputConfiguration

Configuration for the webhook output. Webhooks only have the option to specify what url to send the form submission to.

### interface FreshdeskOutputConfiguration

Configuration for the Freshdesk output. this output can be used for creating a ticket in freshdesk from the form submission. The properties for this configuration are as follows:

- freshdeskHost - The hostname of the freshdesk installation being used
- apiKey - the api key to use to send the request
- customFields - a comma separated list of fields to send through to teh ticket. These field names must be the same in freshdesk as they are in the form itself to ensure the values are mapped across properly

### interface S3FileUploadOutputConfiguration

Configuration for the S3 file upload output. This output will take any file upload fields on the form, and upload them to a specified location. The output works by getting a presigned url from the specified endpoint for each file, and then sending the file using that presigned url. The properties for this configuration are as follows:

- apiKey - the api key to be used to access the specified endpoint
- endpoint - the endpoint to get the presigned url from

### type OutputConfiguration

Union type for all the different output configurations

### type Output
An output is an action to be run on form submission. An output can either send the submission to an external system, such as creating an email or a support ticket, or can make modifications to the form submission using external systems, such as hanging the file upload url to the s3 url.
The properties for an output are as follows:

- name - the machine name for the output
- title - the human friendly name for the output
- type - A type chosen from the OutputType enumerator mentioned above. Helps determine which output to run on form submission
- outputConfiguration - Configuration which relates to the type of output which is to run. Output configuration will be one of the interfaces specified above
- logicExpression - expression which can be used to make changes to a field value before the field is used in the output

### type SpecialPages

A special page is added to the form to specify if this form has a confirmation page to display before submitting the form.

### type Fee
Fees are not used currently and will break forms that try to use them.

### function isMultipleApiKey

This function takes the GOVpay configuration and determines whether one or two api keys are present in the configuration

### type FormDefinition

The FormDefinition type is the master type which contains all information about the form. Many of the types mentioned above appear as properties in this type, and all forms must adhere to this type in order to be processed by the frontend.
The properties for this type are as follows:

- internalOnly - whether this form should only be visible and accessible to internal users
- pages - an array of pages that exist on the form. See the pages section for more information
- conditions - an array of conditions that exist on the form. A condition's machine name will be referred to on other properties where a condition is needed
- lists - An array of lists that exist on the form
- sections - An array of sections that exist on a form
- startPage - the path of the first page in the form
- name - the name of the form. Currently not in use
- feedback - Whether a feedback form exists for this form, and if so, the url of this form
- phaseBanner - A phase banner to be shown at the top of the form
- fees - An array of fees that relate to the form (currently not in use)
- skipSummary - Whether to skip the summary page at the end of the form
- outputs - An array of outputs to be executed on form completion
- declaration - If a declaration is needed on this form, the string to display for the declaration
- metadata - Any metadata to be added to the form
- payApiKey - the api key for GOVpay. Can be blank if no GOVpay integration
- specialPages - Whether any special pages exist on the form
- logicExpressions - An array of logic expression which exist on the form

## form

This directory holds the formConfiguration type. This type is used for the form details section, which helps set things such as the declaration, the form url, and whether the form has an associated feedback form.

## migration

This diretcory holds a list of migrations which can be run to make changes to form configurations if they become out of date. Currently this can only be done if the form configuration is saved in the internal file system.

## schema

This directory holds the joi form schema which is used for validation of the form configuration when changes are made ot the form. Each type which is contained in the data-model directory has a corresponding joi schema, and this schema will check that the values present on the type are correct. If any of the values are incorrect or do not exist on the schema, the validation will fail.
For more information on what joi does and what you can do with is, go to [the joi website](https://joi.dev/api/?v=17.6.0)

## utils

This directory holds useful functions which can be used across the form builder by certain objects. The functions contained within are fairly self explanatory, and it's rare that anything extra beign craeted will require using them.
