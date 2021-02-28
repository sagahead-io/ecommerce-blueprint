import { Message, MessageAttributes } from '@node-ts/bus-messages'
import {
  toMessageAttributeMap,
  fromMessageAttributeMap,
  SqsMessageAttributes,
} from '@node-ts/bus-sqs/dist/sqs-transport'
import aws, { SQS, SNS, ConfigurationOptions } from 'aws-sdk'
import { PubSubEngine } from 'graphql-subscriptions'
import { PubSubAsyncIterator } from 'graphql-subscriptions/dist/pubsub-async-iterator'
import {
  PubSubOptions,
  ExtendedPubSubOptions,
  ObjectType,
  PubSubMessageBody,
  MessageExecutionHandler,
  MessageAddress,
  SetupPoliciesResult,
  SubscriptionValidationResult,
} from './types'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import Debug from 'debug'
import { TopicArn } from 'aws-sdk/clients/directoryservice'
import { QueueArn } from 'aws-sdk/clients/s3'
import { QueueUrl } from 'aws-sdk/clients/iot'
import { subscriptionARN } from 'aws-sdk/clients/sns'

const debug = Debug('graphql-snssqs-subscriptions')

const MILLISECONDS_IN_SECONDS = 1000

export enum SNSSQSPubSubState {
  Started = 2,
  Starting = 1,
  Stopped = 0,
}

export class SNSSQSPubSub implements PubSubEngine {
  public sqs!: SQS
  public sns!: SNS
  private currentSubscriptionId = 0
  private subscriptionMap: {
    [subId: number]: { queueUrl: string; listener: MessageExecutionHandler }
  } = {}
  private clientConfig: SQS.Types.ClientConfiguration
  private options: ExtendedPubSubOptions = {
    subscriptionArns: [],
    topicsArnCache: [],
    queuesUrlCache: [],
    batchSize: 1,
    processMessagesInBatch: false,
  }

  public constructor(config?: ConfigurationOptions & ConfigurationServicePlaceholders, pubSubOptions?: PubSubOptions) {
    this.clientConfig = config || {}
    const providedOpts = pubSubOptions || {}

    aws.config.update(this.clientConfig)
    this.options = this.addOptions(providedOpts)
    this.sqs = new aws.SQS()
    this.sns = new aws.SNS()

    debug('Pubsub Engine is configured with :', this.options)
    debug('Pubsub Engine client is configured with :', this.clientConfig)
  }

  asyncIterator = <T>(triggers: string | string[]): AsyncIterator<T> => {
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

  // topic:queue e.g. service1-queue1, service1-queue2, service1-queue3-workflow1
  private triggerNameIsValid = (triggerName: string) => {
    try {
      const split = triggerName.split('-')
      return split.length === 2 || split.length === 3
    } catch (e) {
      debug(`${e}`)
      return false
    }
  }

  private setupPolicies = (queueName: string, topicArn: TopicArn): SetupPoliciesResult => {
    const principalFromTopic = topicArn.split(':')[4]
    const queueArn = `arn:aws:sqs:${this.clientConfig.region}:${principalFromTopic}:${queueName}`
    const queueArnDLQ = `${queueArn}DLQ`
    const idFromTopic = `${queueArn}/SQSDefaultPolicy`
    const sourceArn = `${topicArn.substring(0, topicArn.lastIndexOf(':'))}:*`

    return {
      formedQueueArn: queueArn,
      formedDlqQueueArn: queueArnDLQ,
      policy: {
        Version: '2012-10-17',
        Id: `${idFromTopic}`,
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 'SQS:*',
            Resource: queueArn,
            Condition: {
              StringLike: {
                'aws:SourceArn': sourceArn,
              },
            },
          },
        ],
      },
    }
  }

  public publish = async <MessageType extends Message>(
    triggerName: string,
    message: MessageType | ObjectType, // either sending @node-ts/bus interfaced message or just random payload
    messageAttributes?: MessageAttributes,
  ): Promise<void> => {
    if (!this.triggerNameIsValid(triggerName)) {
      console.error(`triggerName should be "topic-queue" or "topic-queue-receiver" format`)
      return
    }

    try {
      const { topicArn } = await this.validateSubscription(triggerName, message)

      const attributeMap = messageAttributes && toMessageAttributeMap(messageAttributes)
      debug('Resolved message attributes', { attributeMap })

      const snsMessage: SNS.PublishInput = {
        TopicArn: topicArn,
        Subject: triggerName,
        Message: JSON.stringify(message),
        MessageAttributes: attributeMap,
      }
      debug('Sending message to SNS', { snsMessage })
      await this.sns.publish(snsMessage).promise()
    } catch (e) {
      debug('Something wrong happened', e)
      console.error(e)
    }
  }

  public validateSubscription = async <MessageType extends Message>(
    triggerName: string,
    message?: MessageType | ObjectType,
  ): Promise<SubscriptionValidationResult> => {
    try {
      const messageIsBusType = message instanceof Message
      const messageAddress: MessageAddress = this.resolveMessageAddress(
        message && messageIsBusType ? message.$name : triggerName,
      )

      if (message && messageIsBusType) {
        if (!triggerName.includes(messageAddress.fullAddress)) {
          throw new Error(`TriggerName should be found in message.$name in order to map the queue and receiver`)
        }
      }

      const topicArn = await this.createTopic(messageAddress.topicName)

      if (!topicArn) {
        throw new Error(`Topic not created either way can not proceed`)
      }

      const queueUrl = await this.createQueue(messageAddress.queueName, topicArn)

      if (!queueUrl) {
        throw new Error(`Queue not created either way can not proceed`)
      }

      await this.subscribeQueueToTopic(topicArn, queueUrl)

      return {
        topicArn,
        queueUrl,
      }
    } catch (e) {
      throw new Error(`Subscription validation failed ${e}`)
    }
  }

  public subscribe = async (triggerName: string, onMessage: MessageExecutionHandler): Promise<number> => {
    if (!this.triggerNameIsValid(triggerName)) {
      return 0
    }

    let result: SubscriptionValidationResult

    try {
      result = await this.validateSubscription(triggerName)

      if (!result) {
        throw new Error(`Subscription invalid`)
      }
    } catch (e) {
      return 0
    }

    const id = this.currentSubscriptionId++

    this.subscriptionMap[id] = {
      queueUrl: result.queueUrl,
      listener: onMessage,
    }

    this.pollMessage(id)

    return id
  }

  public unsubscribe = async (subId: number): Promise<void> => {
    const sub = this.subscriptionMap[subId]

    if (!sub) {
      console.error(`no sub with this id ${subId}`)
      return
    }

    delete this.subscriptionMap[subId]
  }

  public readonly pollMessage = async (id: number): Promise<void> => {
    if (!this.subscriptionMap[id]) {
      return
    }

    const retrievedQueueUrl = this.subscriptionMap[id].queueUrl
    const onMessage = this.subscriptionMap[id].listener
    const params: SQS.ReceiveMessageRequest = {
      QueueUrl: retrievedQueueUrl,
      WaitTimeSeconds: 10,
      MaxNumberOfMessages: this.options.batchSize,
      MessageAttributeNames: ['.*'],
      AttributeNames: ['ApproximateReceiveCount'],
    }

    try {
      const { Messages } = await this.sqs.receiveMessage(params).promise()

      if (!Messages || Messages.length === 0) {
        throw new Error(`No Messages`)
      }

      // Only handle the expected number of messages, anything else just return and retry
      if (Messages.length > this.options.batchSize) {
        debug('Received more than the expected number of messages', {
          expected: this.options.batchSize,
          received: Messages.length,
        })
        await Promise.all(Messages.map((message) => this.makeMessageVisible(retrievedQueueUrl, message)))
        throw new Error(`messages size is more than batchSize`)
      }

      debug('Received result and messages', {
        resultMessages: Messages,
      })

      const messages = await Promise.all(Messages.map((messages) => this.processMessage(retrievedQueueUrl, messages)))

      if (this.options.processMessagesInBatch) {
        onMessage(messages)
      } else {
        messages.map((message) => onMessage([message]))
      }
    } catch (e1) {
      Debug(e1)
    }

    setImmediate(() => this.pollMessage(id))
  }

  private processMessage = async (queueUrl: QueueUrl, raw: SQS.Message): Promise<PubSubMessageBody> => {
    if (!raw.Body) {
      const error = 'Message is not formatted with an SNS envelope and will be discarded'
      debug(error, {
        raw,
      })
      await this.deleteMessage(queueUrl, raw)
      throw new Error(error)
    }

    const domainMessage = JSON.parse(raw.Body)

    try {
      const mappedAttributes = this.mapAwsMessageAttributesToBusTypeAttributes(raw.MessageAttributes)
      const attributes = fromMessageAttributeMap(mappedAttributes)

      debug('Received message attributes', {
        transportAttributes: raw.MessageAttributes,
        messageAttributes: attributes,
      })

      await this.deleteMessage(queueUrl, raw)

      debug(`Valid message id ${raw.MessageId}`)

      return {
        id: raw.MessageId || '', // not sure if message could not have id
        raw,
        domainMessage,
        attributes, // attributes is converted to bus type
      }
    } catch (e) {
      debug("Message will be retried, though it's likely to end up in the dead letter queue", {
        raw,
        e,
      })
      await this.makeMessageVisible(queueUrl, raw)
      throw new Error(`Something went wrong while validating message ${e}`)
    }
  }

  public warmup = async (): Promise<void> => {
    try {
      await this.fetchTopicsToCache()
      await this.fetchQueuesToCache()
      await this.fetchSubscriptionsToCache()
    } catch (e) {
      console.error(`Unable to warmup pubsub`)
      return
    }
  }

  private fetchSubscriptionsToCache = async (): Promise<void> => {
    if (!this.options.topicsArnCache.length) {
      console.error('no topics fetched and cached')
      return
    }

    try {
      const subscriptions = await Promise.all(
        this.options.topicsArnCache.map(async (topicArn) => {
          try {
            const { Subscriptions } = await this.sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise()
            return Subscriptions || []
          } catch (e) {
            throw new Error(e)
          }
        }),
      )

      const flattened = subscriptions.flat()
      const subArns = flattened.map((sub: SNS.Subscription) => sub.SubscriptionArn)

      this.options.subscriptionArns = subArns.reduce<TopicArn[]>((a, c) => {
        return c !== undefined ? [...a, c] : a
      }, [])
    } catch (error) {
      debug(`Unable to subscribe with these options ${this.options}, error: ${error}`)
      return undefined
    }
  }

  private fetchTopicsToCache = async (): Promise<void> => {
    try {
      const { Topics } = await this.sns.listTopics().promise()
      if (!Topics) {
        this.options.topicsArnCache = []
      } else {
        const topicArns: (TopicArn | undefined)[] = Topics.map<TopicArn | undefined>((topic) => topic.TopicArn)
        this.options.topicsArnCache = topicArns.reduce<TopicArn[]>((a, c) => {
          return c !== undefined ? [...a, c] : a
        }, [])
      }
    } catch (error) {
      console.error(`Unable to fetch topics, might be problem when publishing messages ${this.options}, error ${error}`)
    }

    return
  }

  private fetchQueuesToCache = async (): Promise<void> => {
    try {
      const { QueueUrls } = await this.sqs.listQueues().promise()
      this.options.queuesUrlCache = QueueUrls || []
    } catch (error) {
      console.error(`Unable to fetch queues, might be problem when publishing messages ${this.options}, error ${error}`)
    }

    return
  }

  private createTopic = async (name: string): Promise<string | undefined> => {
    const resolvedTopicArn = this.resolveTopicArnFromCache(name)

    if (resolvedTopicArn) {
      return resolvedTopicArn
    }

    try {
      const { TopicArn } = await this.sns.createTopic({ Name: `${name}` }).promise()

      if (TopicArn) {
        this.options.topicsArnCache = [...this.options.topicsArnCache, TopicArn]
      }

      return TopicArn
    } catch (error) {
      throw new Error(`Topic creation failed. ${error}`)
    }
  }

  private createQueue = async (name: string, topicArn: TopicArn): Promise<string | undefined> => {
    const resolvedQueueUrl = this.resolveQueueUrlFromCache(name)

    if (resolvedQueueUrl) {
      return resolvedQueueUrl
    }

    const queueName = name
    const queueNameDLQ = `${name}DLQ`
    const policyConfig = this.setupPolicies(queueName, topicArn)

    const policy = {
      Policy: JSON.stringify(policyConfig.policy),
      RedrivePolicy: `{"deadLetterTargetArn":"${policyConfig.formedDlqQueueArn}","maxReceiveCount":"10"}`,
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
      await this.sqs.createQueue(paramsDLQ).promise()
      const { QueueUrl } = await this.sqs.createQueue(params).promise()
      if (QueueUrl) {
        this.options.queuesUrlCache = [...this.options.queuesUrlCache, QueueUrl]
      }
      return QueueUrl
    } catch (error) {
      throw new Error(`Queue creation failed. ${error}`)
    }
  }

  private subscribeQueueToTopic = async (topic: TopicArn, endpoint: QueueArn): Promise<void> => {
    const exists = this.options.subscriptionArns.find(
      (sub: subscriptionARN) => sub.substring(0, sub.lastIndexOf(':')) === topic,
    )

    if (exists) {
      return
    }

    try {
      const { SubscriptionArn } = await this.sns
        .subscribe({
          TopicArn: topic,
          Protocol: 'sqs',
          Endpoint: endpoint,
          Attributes: {
            RawMessageDelivery: 'true',
          },
          ReturnSubscriptionArn: true,
        })
        .promise()

      if (SubscriptionArn) {
        this.options.subscriptionArns = [...this.options.subscriptionArns, SubscriptionArn]
      }
    } catch (error) {
      debug(`Unable to subscribe with these options ${this.options}, error: ${error}`)
      return undefined
    }
  }

  private makeMessageVisible = async (queueUrl: QueueUrl, sqsMessage: SQS.Message): Promise<void> => {
    const changeVisibilityRequest: SQS.ChangeMessageVisibilityRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: sqsMessage.ReceiptHandle!,
      VisibilityTimeout: this.calculateVisibilityTimeout(sqsMessage),
    }

    await this.sqs.changeMessageVisibility(changeVisibilityRequest).promise()
  }

  private deleteMessage = async (queueUrl: QueueUrl, sqsMessage: SQS.Message): Promise<void> => {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: sqsMessage.ReceiptHandle!,
    }

    try {
      await this.sqs.deleteMessage(params).promise()
    } catch (error) {
      debug(`Unable to delete message ${error}`)
      return
    }
  }

  private resolveQueueUrlFromCache = (name: string): string | undefined => {
    if (this.options.queueUrlResolverFn) {
      return this.options.queueUrlResolverFn(name)
    }

    const queueUrl = this.options.queuesUrlCache.find((queue: QueueUrl) => queue.includes(`/${name}`))

    return queueUrl
  }

  private resolveTopicArnFromCache = (name: string): string | undefined => {
    if (this.options.topicArnResolverFn) {
      return this.options.topicArnResolverFn(name)
    }

    const topicArn = this.options.topicsArnCache.find((topic: TopicArn) => {
      const topicParts = topic.split(':')
      const topicName = topicParts[5]
      return topicName === name
    })

    return topicArn
  }

  private resolveMessageAddress = (triggerName: string): MessageAddress => {
    const resolvedAddressTopic = this.options.topicResolverFn
      ? this.options.topicResolverFn(triggerName)
      : triggerName.split('-')[0]
    const resolvedAddressQueue = this.options.topicResolverFn
      ? this.options.topicResolverFn(triggerName)
      : triggerName.split('-')[1]

    const fullAddress = `${resolvedAddressTopic}-${resolvedAddressQueue}`

    return {
      fullAddress,
      topicName: resolvedAddressTopic,
      queueName: resolvedAddressQueue,
    }
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
