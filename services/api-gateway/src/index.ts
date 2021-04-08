import Fastify from 'fastify'
import cors from 'fastify-cors'
import mercurius, { MercuriusContext } from 'mercurius'
import logger from './utils/logger'
import env from './utils/env'
import { introspectFederatedSchemas } from './utils/schemaHandling'
// import { GatewayPubSub } from './pubsub/gateway'
import mercuriusCodegen from 'mercurius-codegen'
// import { authHandle } from './hooks/auth'

const bootstrap = async (): Promise<void> => {
  try {
    await introspectFederatedSchemas()
  } catch (e0) {
    throw new Error(e0)
  }

  try {
    const gateway = Fastify()

    await gateway.register(mercurius, {
      jit: 1,
      graphiql: 'playground',
      gateway: {
        services: env.FEDERATED_SERVICES.map((service) => {
          return {
            ...service,
            rewriteHeaders: (headers) => {
              if (headers.authorization) {
                return {
                  authorization: headers.authorization,
                }
              }
              return {}
            },
          }
        }),
        pollingInterval: 4000,
        errorHandler: (error, service) => {
          if (service.mandatory) {
            throw new Error(`Service is mandatory and not reachable ${error}`)
          } else {
            logger.error(`${error}`)
          }
        },
      },
      subscription: {
        onDisconnect: (context: MercuriusContext) => {
          console.log('on disconnect', context)
        },
      },
    })

    gateway.get('/health', async () => {
      return {}
    })

    gateway.register(cors, { origin: '*' })

    gateway.listen(env.PORT, (address) => {
      if (env.SERVICE_DEVELOPMENT) {
        mercuriusCodegen(gateway, {
          targetPath: '../../frontends/web/__api__/schema.ts',
          codegenConfig: {
            scalars: {
              DateTime: 'Date',
            },
          },
          outputSchema: '../../frontends/web/__api__/schema.gql',
        })
      }
      logger.info(`up and running ${address}`)
    })
  } catch (e2) {
    throw new Error(e2)
  }
}

bootstrap().catch(logger.error)
