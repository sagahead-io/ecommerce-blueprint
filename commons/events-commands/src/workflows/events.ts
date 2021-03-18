import { Event } from '@node-ts/bus-messages'
import { Command } from '@node-ts/bus-messages'

export enum WORKFLOWS_ROUTING_KEYS {
  order = `@services/workflows/order`,
  example = `@services/workflows/example`,
}

export class OrderSomething extends Command {
  readonly $name = WORKFLOWS_ROUTING_KEYS.order
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}

export class StartExampleWorkflow extends Event {
  readonly $name = WORKFLOWS_ROUTING_KEYS.example
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
