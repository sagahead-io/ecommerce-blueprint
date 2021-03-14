import { AMQPPubSub } from 'graphql-amqp-subscriptions'
import amqp from 'amqplib'
import env from '../utils/env'

export let pubsub: AMQPPubSub

export const initPubSub = async (): Promise<AMQPPubSub> => {
  try {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672?heartbeat=30')

    pubsub = new AMQPPubSub({
      connection: conn,
      exchange: {
        name: env.SERVICE_EXCHANGE,
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      queue: {
        name: env.SERVICE,
        options: {
          exclusive: true,
          durable: true,
          autoDelete: false,
        },
        unbindOnDispose: false,
        deleteOnDispose: false,
      },
    })

    return pubsub
  } catch (e) {
    throw new Error(`Unable to get pubsub`)
  }
}
