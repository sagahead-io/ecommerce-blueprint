import 'reflect-metadata'
import Fastify, { FastifyRequest } from 'fastify'
import mercurius, { MercuriusCommonOptions } from 'mercurius'
import buildFederatedSchema from '@libs/build-federated-schema'
import { BuildSchemaOptions } from 'type-graphql'

type CustomOptions = {
  port: string | number
}
export interface FederationServerOptions {
  schemaOpts: BuildSchemaOptions
  serverOpts: MercuriusCommonOptions
  customOpts: CustomOptions
}

export const bootstrapFederatedServer = async ({ schemaOpts, serverOpts, customOpts }: FederationServerOptions) => {
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
      ...serverOpts,
    }
    await fastify.register(mercurius, composedServerOptions)

    fastify.get('/health', async () => {
      return {}
    })

    result = await fastify.listen(customOpts.port)
  } catch (err) {
    throw new Error(err)
  }

  return result
}
