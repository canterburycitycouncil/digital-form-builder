# Server config

When the server is created, we pass some configuration to it to determine how the server behaves. Some of these configuration variables are hardcoded, however many of them are dynamic and can be modified to suit your use case. These configuration variables can be modified by declaring them in a .env file at the root of the designer directory.

## config.ts file

The config.ts file is where the default config is created, and then subsequently overwritten with the environment variables you have specified. There are 3 parts to the file:

- interface - The interface declares what properties exist on the configuration object and what types they can be. This then makes it easy to use config properties in multiple areas of the server
- schema - The schema is used to make sure that the environment variables supplied adhere to the types and properties declared in the interface. If any properties are added that don't adhere to the types from the interface, an error is thrown.
- config object - This is where the configuration object is properly created. The properties are populated from environment variables, if the variable in question exists, and if not a default variable is supplied.

## where config is used

Config will be used in different places depending on a few of the most important configuration properties supplied. For example, different configuration variables will be used depending on the persistence service that's being used.
