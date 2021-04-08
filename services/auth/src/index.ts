import { bootstrapFederatedServer } from '@commons/federated-server'
import { FastifyRequest } from 'fastify'
import { HelloResolver } from './resolvers/Hello'
import { NotificationResolver } from './resolvers/Notification'
import env from './utils/env'
import logger from './utils/logger'
import { initPubSub } from './connectors/pubsub'
import * as db from './connectors/db'
import { authGuard, AuthGuardContext } from '@commons/utils'
import { LoginResolver } from './resolvers/login.resolver'
import { Auth0ManagementClientType } from '@commons/integrate-auth0'
import { initAuth0 } from './connectors/auth0'
import { LoginChallengeResolver } from './resolvers/login-challenge.resolver'
import { Account } from './entities/account.entity'
import { MeResolver } from './resolvers/me.resolver'

export type ServiceContext = FastifyRequest &
  AuthGuardContext & {
    em: db.EntityManagerType
    auth0Management: Auth0ManagementClientType
    logger: typeof logger
  }

const start = async () => {
  try {
    const orm = await db.openConnection()
    const pubSub = await initPubSub()
    const auth0 = await initAuth0()
    const authChecker = await authGuard<ServiceContext>()
    const result = await bootstrapFederatedServer({
      schemaOpts: {
        authChecker,
        resolvers: [HelloResolver, NotificationResolver, LoginResolver, LoginChallengeResolver, MeResolver],
        pubSub,
        orphanedTypes: [Account],
      },
      adapterOpts: {
        graphiql: env.SERVICE_DEVELOPMENT ? 'playground' : false,
        context: (request: FastifyRequest) =>
          ({
            ...request,
            em: orm.em.fork(),
            auth0Management: auth0.managementClient,
            logger,
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
