import { SQS } from 'aws-sdk'
import { MessageAttributes, Message } from '@node-ts/bus-messages'
import { SQSMessageBody } from '@node-ts/bus-sqs/dist/sqs-transport'
import { TopicArn } from 'aws-sdk/clients/directoryservice'
import { subscriptionARN } from 'aws-sdk/clients/sns'
import { QueueArn } from 'aws-sdk/clients/s3'
import { QueueUrl } from 'aws-sdk/clients/iot'

export type PubSubOptions = {
  batchSize?: number
  processMessagesInBatch?: boolean
}

export type ExtendedPubSubOptions = {
  processMessagesInBatch: boolean
  batchSize: number
  subscriptionArns: subscriptionARN[]
  topicsArnCache: TopicArn[]
  queuesUrlCache: SQS.Types.QueueUrlList
  topicResolverFn?: (msgName: string) => string
  topicArnResolverFn?: (topic: string) => string
  queueUrlResolverFn?: (queue: string) => string
} & PubSubOptions

export type ObjectType = {
  [key: string]: any
}

export { MessageAttributes, Message }

export type DomainMessageType = Message & ObjectType

export interface PubSubMessageBody extends ObjectType {
  id: string
  raw: any
  domainMessage: DomainMessageType
  attributes: MessageAttributes
}

export type MessageExecutionHandler = (body: PubSubMessageBody[]) => void

export { SQSMessageBody as SNSSQSMessageBody }

export type MessageAddress = {
  fullAddress: string
  topicName: string
  queueName: string
}

export type SetupPoliciesResult = {
  formedQueueArn: QueueArn
  formedDlqQueueArn: QueueArn
  policy: ObjectType
}

export type SubscriptionValidationResult = {
  topicArn: TopicArn
  queueUrl: QueueUrl
}
