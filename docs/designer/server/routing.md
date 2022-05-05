# Server routing

Sometimes, the designer client side may need to communicate with the backend in order to carry out operations which require server side code. In order to access these operations, we create routes which are accessible by the client on the server.

The router plugin is registered in the designer/server/create-server.ts file, and then each new route is registered in the designer/server/plugins/designer.ts file. That explains how to register the routes, but how do you actually add routes to register in the first place?

## designer/server/plugins/routes

This folder holds all of the routes that have been registered by the system. Routes declared in the api.ts file are registered automatically, while the other top level files declare routes that are not likely to change or be added to. Here's a quick run through of each of those top level files and which routes are declared through it:

- app.ts - this file holds all of the routes for all of the pages that are accessible through the client. It holds routes for the landing pages, as well as a wildcard for all child routes of /app. All of these use the designer view, which gives the general layout of the site with a div with the id of root for react to hook into.
- healthCheck.ts - this file holds the health check route, which is just used to check that the designer is running ok. This route does not have any dynamic responses, and instead just sends back a hardcoded json object.
- index.ts - This file provides a top level export for all of the routes fiels so that they can be imported from one place.
- newConfig.ts - This file contains the newConfig route, which is used when creating a new form. Realistically this route can probably be added into the main api.ts file, but exists in a separate file due to being one of the first routes that was created.

## api.ts and helpers.ts

That leaves two files at the top level: the api.ts file and the helpers.ts file. Both of these files have been separated out as they work together quite a lot, and are also likely to be the only top level files you will need to make edits to.

The api.ts file holds all of the api routes. As more complex functionality is introduced into the form builder, the api routes already created may not be enough for you to receive all of the data you need for the new functionality. For example, when the submissions pages were created we needed to create new routes to allow submissions to be retrieved from the database.

The structure of a route in the api.ts file is as follows:

- method - the http method to use to call this route
- path - the path of the route
- options - a json object containing many options that can be used on the route
  - payload - options for what to do with the payload when it comes through
    - parse - if set to true, the payload of the request will be automatically parsed
    - allow - an array of content types to accept as request payloads
    - output - the type of parsing to do on the payload. Options are data to read the payload fully into memory, stream to read the payload to a data stream, and file to read the payload to a file. If data is chosen and parse is true, the payload is converted to a json object, form data, or form decoded depending on the content type
    - multipart - if the content type is multipart, you can choose to have the payload handled differently
    - maxBytes - the maximum size of the incoming payload. By default the maximum size is set to 1 MB
  - cors - options to set how cross origin requests should be handled. If the route should be accessible by another origin (for example, if using a decoupled frontend for displaying forms), then you may need to set some options here to ensure the request is successful.
    - origin - an array of origins to allow request from
    - headers - an array of headers to allow in cross origin requests. If a header is sent that isn't expected in this list the entire request will be rejected
- handler - the handler function to be used when the request successfully hits the route. Hanlder functions can either be a view to be returned, or a function to process the request and return a response from the hapi response toolkit. In this repo, handlers are kept in the handlers folder and are imported into the api.ts file to be used in routes

## helpers.ts

This file holds some utility functions that are useful for route handlers. If there are certain functions that can be abstracted from the handler file they are in, or there's repetitive code used across multiple handlers, this should be moved to the helpers file.

There are some functions already in there that can be used, these are:

- getPublished - used to retrieve a form scheme by its id.
- returnResponse - used to return a json response from ther server. Pass in the response toolkit, a message, a status code, and a content type, and this function will build a server response for you
- getTrueSubmission - used in the runOutputs route handler. With this handler all outputs are run simultaneously and then return a submission they have made edits to. As edits are made simultaneously, multiple versions of the submission are returned with edits made. This function is used to ensure all of these changes are incorporated into the submission which is added to the database

## handlers

Having all routes and route handlers in one file could make the file hard to read, so instead we've elected to split out route handlers into their own files and import them to the main route files to make the routes easy to read. handlers are split into two folders: api and app. The api handlers are handlers that relate to the api.ts file, and app handlers are handlers that relate to the app.ts file.

## types

Some route handlers use complex data structures, and require these structures to be mapped out as types and interfaces. For these handlers, the types and interfaces are declared in a file under the types folder, where they can then be imported and used in the handler.
