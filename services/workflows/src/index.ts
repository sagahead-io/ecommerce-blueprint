import 'reflect-metadata'
import { Container } from 'inversify'
import { LoggerModule } from '@node-ts/logger-core'
import { WINSTON_SYMBOLS, WinstonModule } from '@node-ts/logger-winston'
import { BUS_SYMBOLS, BusModule, ApplicationBootstrap } from '@node-ts/bus-core'
import { WorkflowRegistry, BusWorkflowModule, BUS_WORKFLOW_SYMBOLS } from '@node-ts/bus-workflow'
import { BusPostgresModule, BUS_POSTGRES_SYMBOLS } from '@node-ts/bus-postgres'
import { WorkflowsModule } from './workflows'
import { LoggerConfiguration } from './utils/injectableLogger'
// import { sqsConfiguration } from './configs/aws'
import { dbConfiguration } from './configs/db'
import logger from './utils/logger'
import { ExampleWorkflow } from './workflows/example/ExampleWorkflow'
import { ExampleWorkflowData } from './workflows/example/Data'
// import env from './utils/env'
import { BUS_RABBITMQ_SYMBOLS, BusRabbitMqModule, RabbitMqTransportConfiguration } from '@node-ts/bus-rabbitmq'

const container = new Container()
container.load(new LoggerModule())
container.load(new WinstonModule())
container.load(new BusModule())
container.load(new BusRabbitMqModule())
container.load(new BusWorkflowModule())
container.load(new BusPostgresModule())
container.load(new WorkflowsModule())

// const config = {
//   accessKeyId: env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
//   region: env.AWS_REGION,
// }

// if (env.SERVICE_DEVELOPMENT) {
//   container.rebind(BUS_SQS_INTERNAL_SYMBOLS.Sqs).toConstantValue(
//     new SQS({
//       endpoint: env.AWS_SQS_ENDPOINT,
//       ...config,
//     }),
//   )
//   container.rebind(BUS_SQS_INTERNAL_SYMBOLS.Sns).toConstantValue(
//     new SNS({
//       endpoint: env.AWS_SNS_ENDPOINT,
//       ...config,
//     }),
//   )
// }

const rabbitConfiguration: RabbitMqTransportConfiguration = {
  queueName: 'workflows',
  connectionString: 'amqp://guest:guest@localhost',
  maxRetries: 5,
}

container.rebind(WINSTON_SYMBOLS.WinstonConfiguration).to(LoggerConfiguration)
container.bind(BUS_POSTGRES_SYMBOLS.PostgresConfiguration).toConstantValue(dbConfiguration)
container.bind(BUS_RABBITMQ_SYMBOLS.TransportConfiguration).toConstantValue(rabbitConfiguration)

const bootstrap = async () => {
  const workflows = container.get<WorkflowRegistry>(BUS_WORKFLOW_SYMBOLS.WorkflowRegistry)

  workflows.register(ExampleWorkflow, ExampleWorkflowData)

  await workflows.initializeWorkflows()

  const app = container.get<ApplicationBootstrap>(BUS_SYMBOLS.ApplicationBootstrap)
  await app.initialize(container)
}

bootstrap().catch(logger.error)
