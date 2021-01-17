import 'reflect-metadata'
import Fastify, { FastifyRequest } from 'fastify'
import mercurius, { MercuriusCommonOptions } from 'mercurius'
import buildFederatedSchema from '@libs/build-federated-schema'
import { BuildSchemaOptions } from 'type-graphql'

type ServerOptions = {
  port: string | number
  healthEndpoint?: string
}
export interface FederationServerOptions {
  schemaOpts: BuildSchemaOptions
  adapterOpts: MercuriusCommonOptions
  serverOpts: ServerOptions
}

export const bootstrapFederatedServer = async ({ schemaOpts, adapterOpts, serverOpts }: FederationServerOptions) => {
  let result

  try {
    const fastify = Fastify()
    const schema = await buildFederatedSchema(schemaOpts)
    const composedServerOptions = {
      ...schema,
      context: (request: FastifyRequest) => ({
        ...request,
      }),
      federationMetadata: true,
      ...adapterOpts,
    }
    await fastify.register(mercurius, composedServerOptions)

    fastify.get(serverOpts.healthEndpoint || '/health', async () => {
      return {}
    })

    result = await fastify.listen(serverOpts.port)
  } catch (err) {
    throw new Error(err)
  }

  return result
}
