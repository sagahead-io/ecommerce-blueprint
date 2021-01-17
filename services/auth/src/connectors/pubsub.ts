import { SNSSQSPubSub } from '@sagahead/graphql-snssqs-subscriptions'
import env from '../utils/env'

let awsEndpoints = {}

if (env.SERVICE_DEVELOPMENT) {
  awsEndpoints = {
    sns: {
      endpoint: `${env.LOCAL_AWS_SNS_ENDPOINT}`,
    },
    sqs: {
      endpoint: `${env.LOCAL_AWS_SQS_ENDPOINT}`,
    },
  }
}

export const getPubSub = async (): Promise<SNSSQSPubSub> => {
  const pubsub = new SNSSQSPubSub(
    {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      ...awsEndpoints,
    },
    {
      serviceName: env.SERVICE,
    },
  )
  await pubsub.init()
  return pubsub
}
