# Sagahead.io opinionated monorepo e-commerce blueprint

Cloud native, microservice architecture based, e-commerce platform blueprint

## Stack

- NodeJS
- [Vscode](https://github.com/microsoft/vscode)
- [Yarn v2 (berry)](https://yarnpkg.com/features/pnp) with pnp
- Typescript
- [TypeGraphql](https://github.com/MichalLytek/type-graphql)
- [Fastify + Mercurius](https://github.com/mercurius-js/mercurius)
- [Auth0](https://auth0.com)
- Postgres
- Docker, docker-compose
- [Localstack](https://github.com/localstack/localstack) (for free development using aws)
- React
- Redis

## Installation

**requirements**

- vscode
- node >=14
- docker-compose

**run**

- git clone
- docker-compose up -d
- yarn build
- yarn start

## Justification

The idea is to have e-commerce type api/frontends blueprint. Over the years of microservices development, from time to time I was running into distributed monoliths, devops nightmares, sharing is bad until we go full wet, cyclic dependencies, one service can break everything and all other problems that microservices brings to the world, with this blueprint I would like to tackle the problems my way.

This monorepo blueprint is based on microservices architecture paradigm. Decoupled services that has two adapters to talk, one synchronous another asynchronous or only asynchronous. The downstream services are accessible only via api gateway that is based on graphql. Api gateway is kinda federating downstream schemas and generating the api schema for the frontends. This approach helps to release API changes without any break in the frontends.

Services own the data and can't share databases between, kinda database per service approach. Although services are decoupled, there is still tiny wires between them graphql api-gateway allows to delegate synchronous schema handlings to other services. Events/commands that passes through pubsub has some sort identification for good traceability, something like event/command DTO's. Even if microservice world means everything decoupled, with the help of yarn v2 (berry) is easier to share libs that is common for all the services like server configuration libs, loggers and other utility functions.

One more important thing in this blueprint - to achieve centralized auth handling, field level auth and decorators. For this to implement properly I am relying on auth0, redis, authGuard middlewares. Thanks to smart fastify-gql context sharing approach, it is possible to implement field level auth this way.

There are/will be more good things in this blueprint. Subscriptions and websockets, api schema generation, frontends state handling without redux, saga's and orchestration examples for distributed workflows or long running tasks, improved pubsub mechanism using AWS SNS+SQS and more. React Native for app. Maybe a generation CLI in the future for easier maintenance less of copy pasting.

This is opinionated blueprint.
An alpha version, development in progress.
The blueprint is inspired by the book: [Microservices Patterns](https://microservices.io/about.html)

## Development Docs

TODO...

**folders structure**

```
. # root
├── frontends  # fronteds workspace @frontends/*
│   ├── admin # frontend admin workspace @frontends/admin and source code
│   │   └── src
│   └── web # frontend web workspace @frontends/web and source code
│       └── src
├── libs
│   ├── build-federated-schema # shared lib generates federated graphql schema @libs/build-federated-schema
│   │   └── src
│   ├── federated-server # shared lib fastify server for services @libs/federated-server
│   │   └── src
│   ├── integrate-auth0 # shared lib auth0 integration/installation tooling @libs/integrate-auth0
│   │   └── src
│   └── logger # shared lib logger just a simple logger @libs/logger
│       └── src
└── services # services catalog @services/*
    ├── api-gateway # api gateway server @services/api-gateway source
    │   └── src
    ├── auth # auth service @services/auth source
    │   └── src
    └── workflows # workflows/sagas/orchestrator service @services/workflows source
        └── src
```

## Ideas

- sophisticated data and workflows
- gitops approach using jenkinsx, helm, eks or terraform/terragrunt atlantis and argocd
- frontends served by s3 bucket
- e-wallet on etherum blockchain
- gRPC
- istio for service discovery
- react native app
- service that manipulates data using mongodb
- cqrs (a bit risky and complex)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/sagahead-io/ecommerce-blueprint/issues. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The lib is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the ecommerce-blueprint project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/sagahead-io/ecommerce-blueprint/tree/master/CODE_OF_CONDUCT.md).
