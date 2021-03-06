import { bootstrapFederatedServer } from '@commons/federated-server'
import { FastifyRequest } from 'fastify'
import { HelloResolver } from './resolvers/Hello'
import { NotificationResolver } from './resolvers/Notification'
import env from './utils/env'
import logger from './utils/logger'
import { initPubSub } from './connectors/pubsub'
// import { MercuriusContext } from 'mercurius'
// import { setupAuth0Clients, installAuth0Apps, installAuth0Roles } from '@commons/integrate-auth0'
export type ServiceContext = FastifyRequest

const start = async () => {
  try {
    // TODO: this runs one time during migration only
    // await setupAuth0Clients({
    //   clientId: '??',
    //   clientSecret: ' ?? ',
    //   domain: '??',
    // })
    // await installAuth0Apps({
    //   callbacks: ['http://localhost:3000', 'http://localhost:3000/login'],
    //   allowed_logout_urls: ['http://localhost:3000', 'http://localhost:3000/logout'],
    //   web_origins: ['http://localhost:3000'],
    //   allowed_origins: ['http://localhost:3000'],
    // })
    // await installAuth0Roles(['name surname @gmail.com'])
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
