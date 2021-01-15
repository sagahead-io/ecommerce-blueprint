import * as dotenv from 'dotenv'
import { MercuriusGatewayService } from 'mercurius'

dotenv.config()

const {
  PORT,
  SERVICE,
  HEALTHCHECK,
  // Service discovery
  FEDERATED_SERVICES,
} = process.env

try {
  if (FEDERATED_SERVICES) {
    console.log(
      FEDERATED_SERVICES.split('|').map((item) => {
        return { name: item.split('?')[0], url: item.split('?')[1] }
      }),
    )
  }
} catch (e) {
  console.log(e)
}

const listOfServices = (): MercuriusGatewayService[] => {
  return FEDERATED_SERVICES
    ? FEDERATED_SERVICES.split('|').map((item) => {
        return {
          name: item.split('?')[0],
          url: `${item.split('?')[1]}`,
          wsUrl: `${item.split('?')[2]}`,
          mandatory: item.split('?')[3] === 'true',
        }
      })
    : [{ name: 'auth', url: 'http://127.0.0.1:8091/graphql', wsUrl: 'ws://127.0.0.1:8091/graphql', mandatory: false }]
}

export default {
  SERVICE: SERVICE || 'apigw',
  PORT: PORT || 8090,
  HEALTHCHECK: HEALTHCHECK || '/health',
  FEDERATED_SERVICES: listOfServices(),
}
