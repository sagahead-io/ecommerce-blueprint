# @commons/amqp-bus

A rabbitmq amqp transport adapter for `@node-ts/bus`. Forked from https://github.com/node-ts/bus/tree/master/packages/bus-rabbitmq

## Installation

Install all packages and their dependencies

```bash
npm i reflect-metadata inversify @commons/amqp-bus @node-ts/bus-core
```

Once installed, load the `BusRabbitMqModule` to your inversify container alongside the other modules it depends on:

```typescript
import { Container } from 'inversify'
import { LoggerModule } from '@node-ts/logger-core'
import { BusModule } from '@node-ts/bus-core'
import { BUS_RABBITMQ_SYMBOLS, BusRabbitMqModule, RabbitMqTransportConfiguration } from '@commons/amqp-bus'

const container = new Container()
container.load(new LoggerModule())
container.load(new BusModule())
container.load(new BusRabbitMqModule())

const rabbitConfiguration: RabbitMqTransportConfiguration = {
  queueName: 'accounts-application-queue',
  connectionString: 'amqp://guest:guest@localhost',
  maxRetries: 5,
}
container.bind(BUS_RABBITMQ_SYMBOLS.TransportConfiguration).toConstantValue(rabbitConfiguration)
```

## Configuration Options

The RabbitMQ transport has the following configuration:

- **queueName** _(required)_ The name of the service queue to create and read messages from.
- **connectionString** _(required)_ An amqp formatted connection string that's used to connect to the RabbitMQ instance
- **maxRetries** _(optional)_ The number of attempts to retry failed messages before they're routed to the dead letter queue. _Default: 10_

## Development

Local development can be done with the aid of docker to run the required infrastructure. To do so, run:

```bash
docker run -d -p 8080:15672 -p 5672:5672 rabbitmq:3-management
```
