import { SNSSQSPubSub, Message, MessageAttributes, PubSubMessageBody } from '..'

const triggerName = `integration-test-${Math.random().toString(36).substring(7)}`

class SimpleMessage extends Message {
  $name = `mydomain/${triggerName}/some-msg-subject`

  test: string

  constructor(test: string) {
    super()
    this.test = test
  }
}

const msg = new SimpleMessage('test')

const attributes = new MessageAttributes({
  attributes: {
    stringAttr: 'string',
    numberAttr: 1.24,
  },
  correlationId: 'some-correlation-id-1',
  stickyAttributes: {
    stickyStrAttr: 'string',
    stickyNumberAttr: 123,
  },
})

describe('sns-sqs-pub-sub integration', () => {
  it('@node-ts/bus type messages should work', async (done) => {
    const instance = new SNSSQSPubSub(
      {
        region: 'us-east-2',
        sns: {
          endpoint: `http://localhost:4575`,
        },
        sqs: {
          endpoint: `http://localhost:4576`,
        },
      },
      { serviceName: triggerName, prefix: 'myprefix' },
    )
    await instance.init()
    await instance.publish(triggerName, msg, attributes)
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(new SimpleMessage('test'))
        expect(data.attributes).toEqual(attributes)
      })

      instance.unsubscribe()
      done()
    })
  })

  it('@node-ts/bus batched sns-sqs messages should work', async (done) => {
    const instance = new SNSSQSPubSub(
      {
        region: 'us-east-2',
        sns: {
          endpoint: `http://localhost:4575`,
        },
        sqs: {
          endpoint: `http://localhost:4576`,
        },
      },
      { serviceName: triggerName, batchSize: 3, processMessagesInBatch: true },
    )

    await instance.init()
    await instance.publish(triggerName, new SimpleMessage('test0'), attributes)
    await instance.publish(triggerName, new SimpleMessage('test1'), attributes)
    await instance.publish(triggerName, new SimpleMessage('test2'), attributes)
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 3).toBe(true)

      data.map((data, idx) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(new SimpleMessage(`test${idx}`))
      })

      instance.unsubscribe()
      done()
    })
  })

  it('graphql sns-sqs subscription should work', async (done) => {
    const instance = new SNSSQSPubSub(
      {
        region: 'us-east-2',
        sns: {
          endpoint: `http://localhost:4575`,
        },
        sqs: {
          endpoint: `http://localhost:4576`,
        },
      },
      { serviceName: triggerName },
    )

    const payload = {
      justAPayload: 'test',
    }
    await instance.init()
    await instance.publish(triggerName, payload, attributes)
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payload)
        expect(data.attributes).toEqual(attributes)
      })

      instance.unsubscribe()
      done()
    })
  })

  it('graphql batched sns-sqs subscription should work', async (done) => {
    const instance = new SNSSQSPubSub(
      {
        region: 'us-east-2',
        sns: {
          endpoint: `http://localhost:4575`,
        },
        sqs: {
          endpoint: `http://localhost:4576`,
        },
      },
      { serviceName: triggerName, batchSize: 2, processMessagesInBatch: true },
    )
    const payloads = [
      { justAPayload: 'test2' },
      {
        justAPayload: 'test1',
      },
    ]
    await instance.init()
    await instance.publish(triggerName, payloads[0], attributes)
    await instance.publish(triggerName, payloads[1], attributes)
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 2).toBe(true)

      data.map((data, idx) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payloads[idx])
      })

      instance.unsubscribe()
      done()
    })
  })
})
