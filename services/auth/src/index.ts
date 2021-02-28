import { bootstrapFederatedServer } from '@libs/federated-server'
import { FastifyRequest } from 'fastify'
import { HelloResolver } from './resolvers/Hello'
import { SubscriptionResolver } from './resolvers/Subscription'
import env from './utils/env'
import logger from './utils/logger'
import { WorkflowsSubscriptionResolver } from './resolvers/WorkflowsSubscription'
import { initPubSub } from './connectors/pubsub'
// import { MercuriusContext } from 'mercurius'
// import { setupAuth0Clients, installAuth0Apps, installAuth0Roles } from '@libs/integrate-auth0'
export type ServiceContext = FastifyRequest

const start = async () => {
  try {
    // TODO: this runs one time during migration only
    // await setupAuth0Clients({
    //   clientId: '5CrcRF5dwtRk1ScjhRRrG4vSbQko571I',
    //   clientSecret: 'IWLEDMZ-6epLMLy5-HiunPZVC08hRIv2DveRneU04tu-gsaU1S3NgY2x423FjBiC',
    //   domain: 'dev-2whak4bt.eu.auth0.com',
    // })
    // await installAuth0Apps({
    //   callbacks: ['http://localhost:3000', 'http://localhost:3000/login'],
    //   allowed_logout_urls: ['http://localhost:3000', 'http://localhost:3000/logout'],
    //   web_origins: ['http://localhost:3000'],
    //   allowed_origins: ['http://localhost:3000'],
    // })
    // await installAuth0Roles(['valdas.mazrimas@gmail.com'])
    const pubSub = await initPubSub()
    const result = await bootstrapFederatedServer({
      schemaOpts: {
        resolvers: [HelloResolver, SubscriptionResolver, WorkflowsSubscriptionResolver],
        pubSub,
      },
      adapterOpts: {
        graphiql: 'playground',
        context: (request: FastifyRequest) =>
          ({
            ...request,
          } as ServiceContext),
        subscription: {
          pubsub: pubSub,
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
