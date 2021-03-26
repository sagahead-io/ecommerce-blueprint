export interface ResolvedRoutingObject {
  exchange: string
  routingKey: string
}
export const resolveRouting = (routingAddress: string, defaultExchange: string): ResolvedRoutingObject => {
  const routingParts = routingAddress.split('/')
  let exchange = defaultExchange
  let routingKey = routingAddress

  if (routingParts.length > 2) {
    exchange = `${routingParts[0]}${routingParts[1] ? '/' + routingParts[1] : ''}`
    routingKey = routingParts[1] ? routingParts[2] || '' : ''
  }

  return {
    exchange,
    routingKey,
  }
}
