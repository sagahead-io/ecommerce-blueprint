jest.mock('aws-sdk')
import { SQS } from 'aws-sdk'
import { SNSSQSPubSub, ExtendedPubSubOptions } from '..'

describe('sqs-pub-sub', () => {
  it('should create an instance', async () => {
    const instance = new SNSSQSPubSub({}, { serviceName: 'mysuperservice' })

    expect(instance).toBeDefined()
  })

  it('should fail to create an instance', async () => {
    try {
      const instance = new SNSSQSPubSub({}, { serviceName: 'mysuperservice', batchSize: 11 })
      if (instance) {
        throw new Error('should not be')
      }
    } catch (e) {
      expect(e.message).toBe('batchSize no more than 10')
    }
  })

  it('should create instance with batched and number of messages', async () => {
    const instance = new SNSSQSPubSub(
      {},
      { serviceName: 'mysuperservice', batchSize: 10, processMessagesInBatch: true },
    )
    const options: ExtendedPubSubOptions = instance.getOptions()

    expect(options.batchSize === 10).toBe(true)
    expect(options.processMessagesInBatch).toBe(true)
  })

  it('client is configured', async () => {
    const instance = new SNSSQSPubSub({ computeChecksums: true }, { serviceName: 'mysuperservice', prefix: 'myprefix' })

    const config: SQS.Types.ClientConfiguration = instance.getClientConfig()

    expect(config.computeChecksums).toBeDefined()
    expect(config.computeChecksums).toBe(true)
    expect(instance.init).toBeDefined()
  })
})
