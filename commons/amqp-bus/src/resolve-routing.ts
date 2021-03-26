export interface ResolvedRoutingObject {
  exchange: string
  routingKey: string
}
export const resolveRouting = (routingAddress: string, shouldParseRoutingKey?: boolean): ResolvedRoutingObject => {
  const routingParts = routingAddress.split('/')
  let exchange = routingAddress
  let routingKey = ''

  if (routingParts.length > 2 && shouldParseRoutingKey) {
    exchange = `${routingParts[0]}${routingParts[1] ? '/' + routingParts[1] : ''}`
    routingKey = routingParts[1] ? routingParts[2] || '' : ''
  }

  return {
    exchange,
    routingKey,
  }
}
