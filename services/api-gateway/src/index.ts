import Fastify from 'fastify'
import cors from 'fastify-cors'
import mercurius from 'mercurius'
import logger from './utils/logger'
import env from './utils/env'
import { introspectFederatedSchemas } from './utils/schemaHandling'
import { GatewayPubSub } from './pubsub/gateway'

const bootstrap = async (): Promise<void> => {
  try {
    await introspectFederatedSchemas()
  } catch (e0) {
    throw new Error(e0)
  }

  try {
    const gateway = Fastify()

    await gateway.register(mercurius, {
      graphiql: 'playground',
      gateway: {
        services: env.FEDERATED_SERVICES,
        pollingInterval: 2000,
        errorHandler: (error, service) => {
          if (service.mandatory) {
            throw new Error(`Service is mandatory and not reachable ${error}`)
          } else {
            logger.error(`${error}`)
          }
        },
      },
      subscription: {
        pubsub: new GatewayPubSub(),
        onDisconnect: () => {
          console.log('on disconnect')
          return
        },
        onConnect: (data) => {
          console.log('on connect', data)
          return {
            hi: 'hi',
          }
        },
      },
    })

    gateway.get('/health', async () => {
      return {}
    })

    gateway.register(cors, { origin: '*' })

    const result = await gateway.listen(env.PORT)
    logger.info(`up and running ${result}`)
  } catch (e2) {
    throw new Error(e2)
  }
}

bootstrap().catch(logger.error)
