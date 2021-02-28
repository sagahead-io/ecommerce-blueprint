import { SqsTransportConfiguration } from '@node-ts/bus-sqs'
import env from '../utils/env'

const queueName = env.SERVICE
const deadLetterQueueName = `${env.SERVICE}-DLQ`
const accountid = env.AWS_ACCOUNT_ID

let queueUrl = `https://sqs.${env.AWS_REGION}.amazonaws.com/${accountid}/${queueName}`
let deadLetterQueueUrl = `https://sqs.${env.AWS_REGION}.amazonaws.com/${accountid}/${deadLetterQueueName}`
const queueArn = `arn:aws:sqs:${env.AWS_REGION}:${accountid}:${queueName}`
const deadLetterQueueArn = `arn:aws:sqs:${env.AWS_REGION}:${accountid}:${deadLetterQueueName}`

if (env.SERVICE_DEVELOPMENT) {
  queueUrl = `${env.AWS_SQS_ENDPOINT}/queue/${queueName}`
  deadLetterQueueUrl = `${env.AWS_SQS_ENDPOINT}/queue/${deadLetterQueueName}`
}

export const sqsConfiguration: SqsTransportConfiguration = {
  queueName,
  queueUrl,
  queueArn,
  deadLetterQueueName,
  deadLetterQueueArn,
  deadLetterQueueUrl,

  resolveTopicName: (messageName: string) => {
    const messageNameParts = messageName.split('-')
    const serviceName = messageNameParts[0]
    return serviceName
  },

  resolveTopicArn: (topicName: string) => `arn:aws:sns:${env.AWS_REGION}:${accountid}:${topicName}`,

  queuePolicy: `
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Principal": "*",
        "Effect": "Allow",
        "Action": "SQS:*",
        "Resource": [
          "${deadLetterQueueArn}"
        ]
      }
    ]
  }
`,
}
