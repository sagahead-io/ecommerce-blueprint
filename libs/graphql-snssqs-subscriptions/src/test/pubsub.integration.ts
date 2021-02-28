import { SNSSQSPubSub, Message, MessageAttributes, PubSubMessageBody } from '..'

const topicName = `testt${Math.random().toString(36).substring(7)}`
const queueName = `testq${Math.random().toString(36).substring(7)}`
const triggerName = `${topicName}-${queueName}`

class SimpleMessage extends Message {
  $name = `${topicName}-${queueName}-ResceiverOrResolverName`

  test: string

  constructor(test: string) {
    super()
    this.test = test
  }
}

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

const globalInstance = new SNSSQSPubSub({
  region: 'us-east-2',
  sns: {
    endpoint: `http://localhost:4575`,
  },
  sqs: {
    endpoint: `http://localhost:4576`,
  },
})

describe('sns-sqs-pub-sub integration', () => {
  it('@node-ts/bus type messages should work', async (done) => {
    await globalInstance.publish(triggerName, new SimpleMessage('test'), attributes)
    await globalInstance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(new SimpleMessage('test'))
        expect(data.attributes).toEqual(attributes)
      })

      globalInstance.unsubscribe(0)
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
      { batchSize: 3, processMessagesInBatch: true },
    )

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

      instance.unsubscribe(0)
      done()
    })
  })

  it('graphql sns-sqs subscription should work', async (done) => {
    const instance = new SNSSQSPubSub({
      region: 'us-east-2',
      sns: {
        endpoint: `http://localhost:4575`,
      },
      sqs: {
        endpoint: `http://localhost:4576`,
      },
    })

    const payload = {
      justAPayload: 'test',
    }
    await instance.publish(triggerName, payload, attributes)
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payload)
        expect(data.attributes).toEqual(attributes)
      })

      instance.unsubscribe(0)
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
      { batchSize: 2, processMessagesInBatch: true },
    )
    const payloads = [
      { justAPayload: 'test2' },
      {
        justAPayload: 'test1',
      },
    ]
    await instance.publish(triggerName, payloads[0], attributes)
    await instance.publish(triggerName, payloads[1], attributes)
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 2).toBe(true)

      data.map((data, idx) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payloads[idx])
      })

      instance.unsubscribe(0)
      done()
    })
  })

  it('dynamic queue should work', async (done) => {
    const instance = new SNSSQSPubSub({
      region: 'us-east-2',
      sns: {
        endpoint: `http://localhost:4575`,
      },
      sqs: {
        endpoint: `http://localhost:4576`,
      },
    })
    const payload = { justAPayload: 'dynamic' }
    const triggerName = `${topicName}-queue${Math.random().toString(36).substring(7)}`
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 1).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payload)
      })

      instance.unsubscribe(0)
      done()
    })
    instance.publish(triggerName, payload, attributes)
  })

  it('dynamic topic and queue should work', async (done) => {
    const instance = new SNSSQSPubSub({
      region: 'us-east-2',
      sns: {
        endpoint: `http://localhost:4575`,
      },
      sqs: {
        endpoint: `http://localhost:4576`,
      },
    })
    const payload = { justAPayload: 'dynamic' }
    const triggerName = `topic${Math.random().toString(36).substring(7)}-queue${Math.random()
      .toString(36)
      .substring(7)}`
    await instance.subscribe(triggerName, (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 1).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payload)
      })

      instance.unsubscribe(0)
      done()
    })
    await instance.publish(triggerName, payload, attributes)
  })

  it('static queue subscribed to multiple topics should work', async (done) => {
    const instance = new SNSSQSPubSub({
      region: 'us-east-2',
      sns: {
        endpoint: `http://localhost:4575`,
      },
      sqs: {
        endpoint: `http://localhost:4576`,
      },
    })
    const payload = { justAPayload: 'static' }
    const triggerName1 = `staticTopic1-staticQueue1`
    const triggerName2 = `staticTopic2-staticQueue1`

    const cb = (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 1).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payload)
      })
    }
    await instance.subscribe(triggerName1, cb)
    await instance.subscribe(triggerName2, cb)
    await instance.publish(triggerName1, payload, attributes)
    await instance.publish(triggerName2, payload, attributes)

    instance.unsubscribe(0)
    instance.unsubscribe(1)
    done()
  })

  it('static topic with multiple queues subscriptions should work', async (done) => {
    const instance = new SNSSQSPubSub({
      region: 'us-east-2',
      sns: {
        endpoint: `http://localhost:4575`,
      },
      sqs: {
        endpoint: `http://localhost:4576`,
      },
    })
    const payload = { justAPayload: 'static' }
    const triggerName1 = `staticTopic1-staticQueue1`
    const triggerName2 = `staticTopic1-staticQueue2`
    const cb = (data: PubSubMessageBody[]) => {
      expect(Array.isArray(data)).toBe(true)
      expect(data.length === 1).toBe(true)

      data.map((data) => {
        expect(data.raw.MessageId).toEqual(data.id)
        expect(data.domainMessage).toEqual(payload)
      })

      instance.unsubscribe(0)
    }
    await instance.subscribe(triggerName1, cb)
    await instance.subscribe(triggerName2, cb)
    await instance.publish(triggerName1, payload, attributes)
    await instance.publish(triggerName2, payload, attributes)
    done()
  })

  it('warmup should work', async () => {
    const instance = new SNSSQSPubSub({
      region: 'us-east-2',
      sns: {
        endpoint: `http://localhost:4575`,
      },
      sqs: {
        endpoint: `http://localhost:4576`,
      },
    })
    await instance.warmup()
    const options = instance.getOptions()
    console.log(options)
    const subsIncludesAllTopics = options.subscriptionArns
      .map((sub) => sub.split(':')[5])
      .every((topic) => options.topicsArnCache.map((top) => top.split(':')[5]).includes(topic))

    expect(subsIncludesAllTopics).toBe(true)
  })
})
