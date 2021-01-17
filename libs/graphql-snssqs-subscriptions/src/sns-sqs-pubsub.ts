import { Command, Event, Message, MessageAttributes } from '@node-ts/bus-messages'
import {
  toMessageAttributeMap,
  fromMessageAttributeMap,
  SqsMessageAttributes,
} from '@node-ts/bus-sqs/dist/sqs-transport'
import aws, { SQS, SNS, ConfigurationOptions } from 'aws-sdk'
import { PubSubEngine } from 'graphql-subscriptions'
import { PubSubAsyncIterator } from 'graphql-subscriptions/dist/pubsub-async-iterator'
import { PubSubOptions, ExtendedPubSubOptions, ObjectType, MessageExecutionHandler, PubSubMessageBody } from './types'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import Debug from 'debug'

const debug = Debug('graphql-snssqs-subscriptions')

const MILLISECONDS_IN_SECONDS = 1000

export class SNSSQSPubSub implements PubSubEngine {
  public sqs!: SQS
  public sns!: SNS
  private clientConfig: SQS.Types.ClientConfiguration
  private options: ExtendedPubSubOptions = {
    withSNS: true,
    serviceName: '',
    stopped: false,
    queueUrl: '',
    dlQueueUrl: '',
    dlQueueArn: '',
    queueArn: '',
    topicArn: '',
    subscriptionArn: '',
    availableTopicsList: [],
    batchSize: 1,
    processMessagesInBatch: false,
  }

  public constructor(
    config: ConfigurationOptions & ConfigurationServicePlaceholders = {},
    pubSubOptions: PubSubOptions,
  ) {
    aws.config.update(config)

    this.clientConfig = config
    this.options = this.addOptions(pubSubOptions)
    this.sqs = new aws.SQS()

    if (this.options.withSNS) {
      this.sns = new aws.SNS()
    }

    debug('Pubsub Engine is configured with :', this.options)
    debug('Pubsub Engine client is configured with :', this.clientConfig)
  }

  public init = async (): Promise<void> => {
    try {
      await this.createPubSub()
      debug('Pubsub Engine is created with options:', this.options)
    } catch (error) {
      debug('Pubsub Engine failed to create ', this.options, error)
      return undefined
    }
  }

  public asyncIterator = <T>(triggers: string | string[]): AsyncIterator<T> => {
    return new PubSubAsyncIterator<T>(this, triggers)
  }

  public getOptions = (): ExtendedPubSubOptions => ({ ...this.options })

  public getClientConfig = (): SQS.Types.ClientConfiguration => ({
    ...this.clientConfig,
  })

  private addOptions = (opts: PubSubOptions): ExtendedPubSubOptions => {
    if (opts.batchSize && opts.batchSize > 10) {
      throw new Error(`batchSize no more than 10`)
    }

    return { ...this.options, ...opts }
  }

  private setupPolicies = (queueName: string) => {
    if (!this.options.topicArn) {
      return {}
    }

    const principalFromTopic = this.options.topicArn.split(':')[4]
    const queueArn = `arn:aws:sqs:${this.clientConfig.region}:${principalFromTopic}:${queueName}`
    const queueArnDLQ = `${queueArn}-DLQ`
    const idFromTopic = `${queueArn}/SQSDefaultPolicy`
    this.options.queueArn = queueArn
    this.options.dlQueueArn = queueArnDLQ

    return {
      Version: '2012-10-17',
      Id: `${idFromTopic}`,
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 'SQS:*',
          Resource: queueArn,
        },
      ],
    }
  }

  // generic pubsub engine publish method, still works with @node-ts/bus Event/Command
  async publish<MessageType extends Message>(
    triggerName: string,
    message: MessageType | ObjectType, // either sending @node-ts/bus interfaced message or just random payload
    messageAttributes?: MessageAttributes,
  ): Promise<void> {
    if (message instanceof Message) {
      const resolvedMessageName = this.resolveTopicFromMessageName(message.$name)
      if (resolvedMessageName !== triggerName) {
        if (resolvedMessageName !== `${this.options.prefix}-${triggerName}`) {
          throw new Error(`TriggerName should be found in message.$name in order to map the queue and receiver`)
        }
      }
      await this.publishMessage(message, messageAttributes)
    } else {
      await this.publishMessage(message, messageAttributes, triggerName)
    }
  }

  // same as publish but specific for @node-ts/bus Event
  async sendEvent<EventType extends Event>(event: EventType, messageAttributes?: MessageAttributes): Promise<void> {
    await this.publishMessage(event, messageAttributes)
  }

  // same as publish but specific for @node-ts/bus Command
  async sendCommand<CommandType extends Command>(
    command: CommandType,
    messageAttributes?: MessageAttributes,
  ): Promise<void> {
    await this.publishMessage(command, messageAttributes)
  }

  private async publishMessage(
    message: Message | ObjectType,
    messageAttributes: MessageAttributes = new MessageAttributes(),
    triggerName = '',
  ): Promise<void> {
    const topicName =
      message instanceof Message && !triggerName ? this.resolveTopicFromMessageName(message.$name) : triggerName
    const topicArn = this.resolveTopicArnFromMessageName(topicName)
    debug('Publishing message to sns', { message, topicArn })

    const attributeMap = toMessageAttributeMap(messageAttributes)
    debug('Resolved message attributes', { attributeMap })

    const snsMessage: SNS.PublishInput = {
      TopicArn: topicArn,
      Subject: message.$name,
      Message: JSON.stringify(message),
      MessageAttributes: attributeMap,
    }
    debug('Sending message to SNS', { snsMessage })
    await this.sns.publish(snsMessage).promise()
  }

  public subscribe = (triggerName: string, onMessage: MessageExecutionHandler): Promise<number> => {
    try {
      this.pollMessage(triggerName, onMessage)

      return Promise.resolve(1)
    } catch (error) {
      debug('Error happens before starting to poll', error)
      return Promise.resolve(0)
    }
  }

  public unsubscribe = async (): Promise<void> => {
    if (!this.options.stopped) {
      this.options.stopped = true
    }
  }

  public readonly pollMessage = async (topic: string, onMessage: MessageExecutionHandler): Promise<void> => {
    if (this.options.stopped) {
      return
    }

    const params: SQS.ReceiveMessageRequest = {
      QueueUrl: this.options.queueUrl,
      WaitTimeSeconds: 10,
      MaxNumberOfMessages: this.options.batchSize,
      MessageAttributeNames: ['.*'],
      AttributeNames: ['ApproximateReceiveCount'],
    }

    const result = await this.sqs.receiveMessage(params).promise()

    if (!result.Messages || result.Messages.length === 0) {
      return
    }

    // Only handle the expected number of messages, anything else just return and retry
    if (result.Messages.length > this.options.batchSize) {
      debug('Received more than the expected number of messages', {
        expected: this.options.batchSize,
        received: result.Messages.length,
      })
      await Promise.all(result.Messages.map(async (message) => this.makeMessageVisible(message)))
      return
    }

    debug('Received result and messages', {
      result,
      resultMessages: result.Messages,
    })

    const messages = await Promise.all(result.Messages.map((messages) => this.processMessage(topic, messages)))

    if (this.options.processMessagesInBatch) {
      onMessage(messages)
    } else {
      messages.map((message) => onMessage([message]))
    }
  }

  private processMessage = async (topic: string, sqsMessage: SQS.Message): Promise<PubSubMessageBody> => {
    if (!sqsMessage.Body) {
      const error = 'Message is not formatted with an SNS envelope and will be discarded'
      debug(error, {
        sqsMessage,
      })
      await this.deleteMessage(sqsMessage)
      throw new Error(error)
    }

    const snsMessage = JSON.parse(sqsMessage.Body)

    try {
      // if message is sent for bus type listener check if the message name has the same topic
      if (snsMessage instanceof Message) {
        const msgName = this.resolveTopicFromMessageName(snsMessage.$name)

        if (msgName !== topic) {
          if (msgName !== `${this.options.prefix}-${topic}`) {
            const error = 'Massage is @node-ts/bus based but message.$name does not have same topic'
            debug(error)
            throw new Error(error)
          }
        }
      }

      const mappedAttributes = this.mapAwsMessageAttributesToBusTypeAttributes(sqsMessage.MessageAttributes)
      const attributes = fromMessageAttributeMap(mappedAttributes)

      debug('Received message attributes', {
        transportAttributes: sqsMessage.MessageAttributes,
        messageAttributes: attributes,
      })

      await this.deleteMessage(sqsMessage)

      debug(`Valid message id ${sqsMessage.MessageId}`)

      return {
        id: sqsMessage.MessageId || '', // not sure if message could not have id
        raw: sqsMessage,
        domainMessage: snsMessage,
        attributes, // attributes is converted to bus type
      }
    } catch (e) {
      debug("Message will be retried, though it's likely to end up in the dead letter queue", {
        sqsMessage,
        e,
      })
      await this.makeMessageVisible(sqsMessage)
      throw new Error(`Something went wrong while validating message ${e}`)
    }
  }

  private createPubSub = async (): Promise<void> => {
    // Create SNS Topic and SQS Queue
    try {
      if (this.options.withSNS) {
        await this.createTopic()
      }
      await this.createQueue()
    } catch (error) {
      debug(`Unable to configure PubSub channel ${error}`)
    }

    if (!this.options.withSNS) {
      return
    }

    // Subscribe SNS Topic to SQS Queue
    try {
      const { SubscriptionArn } = await this.sns
        .subscribe({
          TopicArn: this.options.topicArn,
          Protocol: 'sqs',
          Endpoint: this.options.queueArn,
          Attributes: {
            RawMessageDelivery: 'true',
          },
          ReturnSubscriptionArn: true,
        })
        .promise()
      this.options.subscriptionArn = SubscriptionArn!
    } catch (error) {
      debug(`Unable to subscribe with these options ${this.options}, error: ${error}`)
      return undefined
    }

    // Persist available topics in the options
    try {
      const { Topics } = await this.sns.listTopics().promise()
      this.options.availableTopicsList = Topics!
    } catch (error) {
      debug(`Unable to fetch topics, might be problem when publishing messages ${this.options}, error ${error}`)
      return undefined
    }
  }

  private createTopic = async (): Promise<void> => {
    const { serviceName, prefix } = this.options
    const formedPrefix = prefix ? `${prefix}-` : ''
    try {
      const { TopicArn } = await this.sns.createTopic({ Name: `${formedPrefix}${serviceName}` }).promise()
      this.options.topicArn = TopicArn!
    } catch (error) {
      debug(`Topic creation failed. ${error}`)
      return undefined
    }
  }

  private createQueue = async (): Promise<void> => {
    const queueName = this.formQueueName()
    const queueNameDLQ = this.formQueueName('-DLQ')

    const policy = {
      Policy: JSON.stringify(this.setupPolicies(queueName)),
      RedrivePolicy: `{"deadLetterTargetArn":"${this.options.dlQueueArn}","maxReceiveCount":"10"}`,
    }

    const params = {
      QueueName: queueName,
      Attributes: {
        ...policy,
      },
    }

    const paramsDLQ = {
      QueueName: queueNameDLQ,
    }

    try {
      const dlqQueueResult = await this.sqs.createQueue(paramsDLQ).promise()
      const queueResult = await this.sqs.createQueue(params).promise()
      this.options.queueUrl = queueResult.QueueUrl!
      this.options.dlQueueUrl = dlqQueueResult.QueueUrl!
    } catch (error) {
      debug(`Queue creation failed. ${error}`)
      return undefined
    }
  }

  private async makeMessageVisible(sqsMessage: SQS.Message): Promise<void> {
    const changeVisibilityRequest: SQS.ChangeMessageVisibilityRequest = {
      QueueUrl: this.options.queueUrl,
      ReceiptHandle: sqsMessage.ReceiptHandle!,
      VisibilityTimeout: this.calculateVisibilityTimeout(sqsMessage),
    }

    await this.sqs.changeMessageVisibility(changeVisibilityRequest).promise()
  }

  private deleteMessage = async (sqsMessage: SQS.Message): Promise<void> => {
    const params = {
      QueueUrl: this.options.queueUrl,
      ReceiptHandle: sqsMessage.ReceiptHandle!,
    }

    try {
      await this.sqs.deleteMessage(params).promise()
    } catch (error) {
      debug(`Unable to delete message ${error}`)
      return
    }
  }

  private formQueueName = (providedSuffix?: string): string => {
    const { serviceName, prefix } = this.options
    const queueRoot = serviceName
    const formedPrefix = prefix ? `${prefix}-` : ''

    return `${formedPrefix}${queueRoot}${providedSuffix || ''}`
  }

  private resolveTopicArnFromMessageName = (msgTopic: string): string => {
    // if provided topic arn resolve fn
    if (this.options.topicArnResolverFn) {
      return this.options.topicArnResolverFn(msgTopic)
    }

    // topic is itself service
    if (msgTopic === this.options.serviceName) {
      return this.options.topicArn
    }

    // find topic by topic name in the topics list
    const result: SNS.Types.Topic[] = this.options.availableTopicsList.filter((topic: SNS.Types.Topic) => {
      const topicParts = topic.TopicArn!.split(':')
      const topicName = topicParts[5]
      return topicName === msgTopic
    })

    // return found topic or return given argument
    return result ? result[0].TopicArn! : msgTopic
  }

  private resolveTopicFromMessageName = (messageName: string): string => {
    const { prefix } = this.options
    const resolvedTrigger = this.options.topicResolverFn
      ? this.options.topicResolverFn(messageName)
      : messageName.split('/')[1]

    if (prefix) {
      return `${prefix}-${resolvedTrigger}`
    }

    return resolvedTrigger
  }

  private calculateVisibilityTimeout = (sqsMessage: SQS.Message): number => {
    const currentReceiveCount = parseInt(
      (sqsMessage.Attributes && sqsMessage.Attributes.ApproximateReceiveCount) || '0',
      10,
    )
    const numberOfFailures = currentReceiveCount + 1

    const delay: number = 5 ^ numberOfFailures // Delays from 5ms to ~2.5 hrs
    return delay / MILLISECONDS_IN_SECONDS
  }

  private mapAwsMessageAttributesToBusTypeAttributes = (
    sqsAttributes?: SNS.MessageAttributeMap,
  ): SqsMessageAttributes => {
    const attributes: SqsMessageAttributes = {}

    if (!sqsAttributes) {
      return {}
    }

    Object.keys(sqsAttributes).forEach((key) => {
      const attribute = sqsAttributes[key]

      attributes[key] = {
        Type: attribute.DataType,
        Value: attribute.StringValue || '',
      }
    })

    return attributes
  }
}

export type SNSSQSPubSubType = SNSSQSPubSub
