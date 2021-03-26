import { resolveRouting, ResolvedRoutingObject } from './resolve-routing'

describe('User role rule', () => {
  it('should resolve routing with routing key', async () => {
    const exchange = '@service/queue'
    const routingKey = 'routing-key'
    const result: ResolvedRoutingObject = resolveRouting(`${exchange}/${routingKey}`, true)

    expect(result.exchange).toEqual(exchange)
    expect(result.routingKey).toEqual(routingKey)
  })

  it('should resolve routing without routing key', async () => {
    const exchangeName = '@service/queue/full-name'
    const result: ResolvedRoutingObject = resolveRouting(`${exchangeName}`)

    expect(result.exchange).toEqual(exchangeName)
    expect(result.routingKey).toEqual('')
  })
})
