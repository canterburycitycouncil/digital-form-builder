layout: page
title: "Welcome to Digital Form Builder"
permalink: /

# Digital Form Builder

Welcome to the docs for Digital Form Builder. On this site you will find information on the codebase for the form builder, what each area is, what it contains, and how to use it and build on top of it.

**This site is for developers that plan on making changes to the docebase of the form builder. To see information on how to build forms using the digital form builder, please refer to [https://www.canterbury.gov.uk](The Digital Form Builder user's guide.)**

## Key Concepts

When first looking at the codebase for the form builder, it can be a bit daunting due to the size and different jargon in the codebase. You may have question about why we have decided to use certain concepts and how they work, which we hope to explain in better detail here:

### HapiJS

HapiJS is a simple MVC framework built on NodeJS for hosting a server and both client side and server side functionality.
HapiJS has a lot of useful built-in functionlity, as well as additional community modules which assist with building out servers quickly and efficiently.
The routing module makes it easy to add routes to the system and provides a straghtforward configuration for each route, giving each route loads of configuration options to remove the need to create your own middleware.
The plugins module allows you to add all sorts of plugins to your server, whether they be ways of communicating with databases easily, persistence services, or views handlers.

HapiJS also usefully allows for using React frontends with the server's backend to remove the need for two separate servers running and cross origin requests.

For more information about what Hapi can do, and why it's a good framework to choose, visit [Hapi.dev.](https://hapi.dev)

### TypeScript

TypeScript is a compiler which assists with creating robust, highly readable code.
The beauty of Typescript is that it can be as strict or as loose as you want, and by making sure you use it properly from the offset, keeping note of all your different components, what they need, and how they can be instantiated has never been easier.
We have found that in the past development is actually much faster with Typescript, as although you may have to write much more code in terms of creating types and interfaces for all of your variables, it is much easier to standardise your variable and component usage, as well as caputring issues as they are written as opposed to having to troubleshoot your code retrospectively.

If you would like to find out more about how to use Typescript (specifically with React) visit the [Typescript website.](https://www.typescriptlang.org/docs/handbook/react.html)

### GatsbyJS

Although the runner module is included in this repository, our team have opted for using GatsbyJS instead to host the frontend of our forms package.

GatsbyJS is a static site generator built on reactJS. What this means is that you can use a database to provide content to your gatsby site, which can then build out all of your pages as static html; and js files.

This process has some obvious advantages. One of these is speed. Due to no server processes running and all js and css files being aggregated, each page load takes tenths of a second, and due to the single page app nature of the framework all subsequent page loads are instant.
The second benefit of static site generation is cost. As all of the files are static there's no need for a node server to be running, saving on cost by a large amount. This also means that the app is scalable by default, removing the need for advanced autoscaling architecture.

For more information about the benefits of using GatsbyJS, visit the [GatsbyJS website](https://www.gatsbyjs.com/)

### DynamoDB

Although there are a few different options for the persistence service to use for the form builder, the most developed service, adn the one we woukld recommend, is the DynamoDB persistence service.

DynamoDB provides a lot of benefits when working with JSON objects over both traditional database architecture, and storing json objects as files either using the native file system or Amazon S3.

Firstly, DynamoDB is incredibly fast. Due to the way data is stored in DynamoDB retrieval of single items is much quicker than in SQL based databases.
Secondly, DynamoDB is very cheap. Due to the low latency of dynamoDB queries, combined with low object sizes and tables only being active when being used, the cost to use DynamoDB is much cheaper than using SQL and is on a par with using S3.
Thirdly, with DynamoDB you can query objects using any field that is expected on the object, and only return certain fields. This will help with even further cost and performance improvements.

For more information about dynamoDB visit the [DynamoDB sales pages.](https://aws.amazon.com/dynamodb/?trk=326727ca-4917-4e82-8113-929ad925b6a0&sc_channel=ps&sc_campaign=acquisition&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Database|DynamoDB|GB|EN|Text&s_kwcid=AL!4422!3!536393678524!e!!g!!dynamodb&ef_id=Cj0KCQjwgYSTBhDKARIsAB8Kukv0dTIlHSh8vocuXKtOa0ndQrVKhXwUvRVUNoohcMIvl_J5J_V3QncaAgFkEALw_wcB:G:s&s_kwcid=AL!4422!3!536393678524!e!!g!!dynamodb)




