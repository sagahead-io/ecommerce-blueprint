# Sagahead.io opinionated e-commerce monorepo blueprint

The idea is to have e-commerce type api/frontends blueprint. Over the years of microservices development, from time to time I was running into distributed monoliths, devops nightmares, sharing is bad until we go full wet, cyclic dependencies, one service can break everything and all other problems that microservices brings to the world, with this blueprint I would like to tackle the problems my way.

This monorepo blueprint is based on microservices architecture paradigm. Decoupled services that has two adapters to talk, one synchronous another asynchronous or only asynchronous. The downstream services are accessible only via api gateway that is based on graphql. Api gateway is kinda federating downstream schemas and generating the api schema for the frontends. This approach helps to release API changes without any break in the forntends.

Services own the data and can't share databases between, kinda database per service approach. Although services are decoupled, there is still tiny wires between them graphql api-gateway allows to delegate synchronous schema handlings to other services. Events/commands that passes through pubsub has some sort identification for good traceability, something like event/command DAO's. Even if microservice world means everything decoupled, with the help of yarn v2 (berry) is easier to share libs that is common for all the services like server configuration libs, loggers and other utility functions.

One more important thing in this blueprint - to achieve centralized auth handling, field level auth and decorators. For this to implement properly I am relying on auth0, redis, authGuard middlewares. Thanks to smart fastify-gql context sharing approach, it is possible to implement field level auth this way.

There are/will be more good things in this blueprint. Subscriptions and websockets, api schema generation, frontends state handling without redux, saga's and orchestration examples for distributed workflows or long running tasks, improved pubsub mechanism using AWS SNS+SQS and more. React Native for app. Maybe a generation CLI in the future for easier maintenance less of copy pasting.

This is opinionated blueprint.
An alpha version, development in progress.
The blueprint is inspired by the book: [Microservices Patterns](https://microservices.io/about.html)

_Stack_

- vscode
- yarn v2 (berry) with pnp
- typescript
- type-grapqhl
- fastify + mercurius
- auth0
- postgres
- docker
- localstack (for free development using aws)
- react
- redis

## Docs

TODO...

## Contribution

Contributions is still on hold until I prepare MVP, but if you want to try it it:
** requirements **

- vscode
- node >=14
- docker-compose

** run **

- git clone
- docker-compose up -d
- yarn build
- yarn start
