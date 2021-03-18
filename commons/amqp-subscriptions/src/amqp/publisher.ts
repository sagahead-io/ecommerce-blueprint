import amqp from 'amqplib'
import Debug from 'debug'
import { PubSubAMQPConfig, Exchange } from './interfaces'
import { resolveRouting } from './resolve-routing'

export class AMQPPublisher {
  private connection: amqp.Connection
  private exchange: Exchange
  private channel: amqp.Channel | null = null

  constructor(config: PubSubAMQPConfig, private logger: Debug.IDebugger) {
    this.connection = config.connection
    this.exchange = {
      name: 'graphql_subscriptions',
      type: 'topic',
      options: {
        durable: false,
        autoDelete: false,
      },
      ...config.exchange,
    }
  }

  public async publish(routingAddress: string, data: any): Promise<void> {
    const channel = await this.getOrCreateChannel()
    const { exchange, routingKey } = resolveRouting(routingAddress, this.exchange.name)

    await channel.assertExchange(exchange, this.exchange.type, this.exchange.options)
    await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)))
    this.logger('Message sent to Exchange "%s" with Routing Key "%s" (%j)', exchange, routingKey, data)
  }

  private async getOrCreateChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      this.channel = await this.connection.createChannel()
      this.channel.on('error', (err) => {
        this.logger('Publisher channel error: "%j"', err)
      })
    }
    return this.channel
  }
}
