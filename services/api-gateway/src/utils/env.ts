import * as dotenv from 'dotenv'
import { MercuriusGatewayService } from 'mercurius'

dotenv.config()

const {
  PORT,
  SERVICE,
  HEALTHCHECK,
  LOCAL_AWS_SNS_ENDPOINT,
  LOCAL_AWS_SQS_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
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
    : [
        {
          name: 'auth',
          url: 'http://127.0.0.1:8091/graphql',
          wsUrl: 'ws://127.0.0.1:8091/graphql',
          mandatory: false,
          wsConnectionParams: { connectionCallback: () => console.log('conneciton callback'), reconnect: true },
        },
      ]
}

export default {
  SERVICE: SERVICE || 'api-gateway',
  PORT: PORT || 8090,
  HEALTHCHECK: HEALTHCHECK || '/health',
  FEDERATED_SERVICES: listOfServices(),
  AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: AWS_REGION || 'eu-central-1',
  SERVICE_DEVELOPMENT: process.env.NODE_ENV === 'development',
  LOCAL_AWS_SNS_ENDPOINT: LOCAL_AWS_SNS_ENDPOINT || 'http://localhost:4575',
  LOCAL_AWS_SQS_ENDPOINT: LOCAL_AWS_SQS_ENDPOINT || 'http://localhost:4576',
}
