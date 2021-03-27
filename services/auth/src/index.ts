import { bootstrapFederatedServer } from '@commons/federated-server'
import { FastifyRequest } from 'fastify'
import { HelloResolver } from './resolvers/Hello'
import { NotificationResolver } from './resolvers/Notification'
import env from './utils/env'
import logger from './utils/logger'
import { initPubSub } from './connectors/pubsub'
import * as db from './connectors/db'
export type ServiceContext = FastifyRequest

const start = async () => {
  try {
    await db.openConnection()
    const pubSub = await initPubSub()
    const result = await bootstrapFederatedServer({
      schemaOpts: {
        resolvers: [HelloResolver, NotificationResolver],
        pubSub,
      },
      adapterOpts: {
        graphiql: 'playground',
        context: (request: FastifyRequest) =>
          ({
            ...request,
          } as ServiceContext),
        subscription: {
          onConnect: (data) => {
            console.log('on connect', data)
            return {
              hi: 'hi',
            }
          },
          onDisconnect: () => {
            console.log('on disconnect')
          },
        },
      },
      serverOpts: {
        port: env.PORT,
      },
    })

    logger.info(`up and running ${result}`)
  } catch (e) {
    logger.error(e)
  }
}

start()
