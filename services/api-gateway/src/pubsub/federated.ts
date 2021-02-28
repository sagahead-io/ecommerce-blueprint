import { SNSSQSPubSub, SNSSQSPubSubType } from '@sagahead/graphql-snssqs-subscriptions'
import env from '../utils/env'

export let pubsub: SNSSQSPubSubType

export const initPubSub = async (): Promise<SNSSQSPubSubType> => {
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

  try {
    const pubsubInstance = new SNSSQSPubSub({
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      ...awsEndpoints,
    })

    await pubsubInstance.warmup()

    // pubsubInstance.subscribe('auth-subscription', async (data) => {
    //   console.log(`trigger name auth-subscription`, data)
    // })

    pubsub = pubsubInstance

    return pubsub
  } catch (e) {
    throw new Error(`Unable to get pubsub`)
  }
}
