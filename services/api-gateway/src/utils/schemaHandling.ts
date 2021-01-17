import env from './env'
import { print } from 'graphql'
import { MercuriusGatewayService } from 'mercurius'
import { introspectSchema } from '@graphql-tools/wrap'
import { AsyncExecutor } from '@graphql-tools/delegate'
import fetch from 'isomorphic-fetch'
import logger from './logger'

interface ExecutorData {
  document: any
  variables: any
  context?: any
}

const makeExecutor = async (url: string) => {
  return async ({ document, variables }: ExecutorData) => {
    const query = print(document)

    let result

    try {
      result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      })
    } catch (e) {
      throw new Error(e)
    }

    return result.json()
  }
}

const checkSchemaIntrospection = (executor: AsyncExecutor, service: MercuriusGatewayService): Promise<void> => {
  return new Promise((resolve) => {
    introspectSchema(executor)
      .then(() => {
        logger.info(`Graphql successfully introspected from ${service.name}`)
        resolve()
      })
      .catch(() => {
        logger.error(`Failed initial schema introspection from ${service.name}`)
        setTimeout(() => resolve(checkSchemaIntrospection(executor as AsyncExecutor, service)), 2000)
      })
  })
}

export const introspectFederatedSchemas = async () => {
  return await Promise.all(
    env.FEDERATED_SERVICES.map(async (service: MercuriusGatewayService) => {
      const executor = await makeExecutor(service.url)

      try {
        await checkSchemaIntrospection(executor as AsyncExecutor, service)
      } catch (e) {
        throw new Error(`Unable to fetch schema ${e}`)
      }

      return
    }),
  )
}
