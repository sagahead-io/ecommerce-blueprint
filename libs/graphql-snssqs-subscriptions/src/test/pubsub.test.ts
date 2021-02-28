jest.mock('aws-sdk')
import { SQS } from 'aws-sdk'
import { SNSSQSPubSub, ExtendedPubSubOptions } from '..'
import { PubSubMessageBody } from '../types'

describe('sqs-pub-sub', () => {
  it('should create an instance', async () => {
    const instance = new SNSSQSPubSub()

    expect(instance).toBeDefined()
  })

  it('should fail to create an instance', async () => {
    try {
      const instance = new SNSSQSPubSub({}, { batchSize: 11 })
      if (instance) {
        throw new Error('should not be')
      }
    } catch (e) {
      expect(e.message).toBe('batchSize no more than 10')
    }
  })

  it('should create instance with batched and number of messages', async () => {
    const instance = new SNSSQSPubSub({}, { batchSize: 10, processMessagesInBatch: true })
    const options: ExtendedPubSubOptions = instance.getOptions()

    expect(options.batchSize === 10).toBe(true)
    expect(options.processMessagesInBatch).toBe(true)
  })

  it('client is configured', async () => {
    const instance = new SNSSQSPubSub({ computeChecksums: true })
    const config: SQS.Types.ClientConfiguration = instance.getClientConfig()

    expect(config.computeChecksums).toBeDefined()
    expect(config.computeChecksums).toBe(true)
    expect(instance).toBeDefined()
  })

  it('subscribe should return 0 if incorrect triggerName', async () => {
    const instance = new SNSSQSPubSub()

    const result = await instance.subscribe(`incorrectName`, (data: PubSubMessageBody[]) => {
      console.log(data)
    })

    expect(result).toBe(0)
  })
})
