# Designer - Server

the form builder contains a designer module which is used for the actual building of the form. The designer is split into two sections: the server which handles communicating with the persistence service and validating the form configuration, and a client side which handles displaying the designer and allowing the user to edit the form configuration.
This section will concentrate on the server, to access information on the client [click here.](/digital-form-builder/designer/client.html)
There are a few different parts which you will need to know about in order to make changes to the designer, as well as some additional information which will prove useful for understanding how the server functions.

## CreateServer

The first step to creating the server is just that: creating the server. When this function is triggered, it tells the system to spin up a nodejs server on the specified port, with additional configuration as well.
After the server has been created with the specified options, plugins are added to adde certain functionality to the server. You can find more information about some of the plugins that are registered in the [hapiJS plugin directory.](https://hapi.dev/plugins/)
The view plugin is used to configure the templating engine used.
The Schmervice plugin is used for registering the persistence service that will be used for storing and accessing the form configurations.
The designer plugin is used for creating and serving the routes for the designer. In this plugin, all routes for accessing form configurations, as well as the routes for serving the frontend are created and registered. When a new route is created, the route will need to be imported here and then created using server.route.
Once the server has been created, the system is markedas online and users can start accessing the client side of the system.

## server routing

All backend functions which handle the processing, uploading and retrieving of data that need to be accessible by the designer frontend must be declared as routes. For more information, please go to the [server routing section.](/digital-form-builder/designer/server/routing.html)

## server config

There are options you can pass to the designer in the form of environment variables which change how the system operates. For more information on these, please go to the [server config section.](/digital-form-builder/designer/server/config.html)

## server persistence services

Persistence services are used to store form configurations and send them through to the designer frontend. For more information, please go to the [server persistence services section.](/digital-form-builder/designer/server/persistence.html)

## server outputs

Outputs are operations that run on form completion to make changes to the submission or to push information into back office systems. For example, you might have an output which uploads files to a file system and then replaces the files in the submission to the uploaded urls. For more information, please go to the [server outputs section.](/digital-form-builder/designer/server/outputs.html)
