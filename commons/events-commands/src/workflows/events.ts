import { Event } from '@node-ts/bus-messages'
import { Command } from '@node-ts/bus-messages'

export class OrderSomething extends Command {
  static NAME = '@services/workflows/order'
  readonly $name = OrderSomething.NAME
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}

export class StartExampleWorkflow extends Event {
  static NAME = '@services/workflows/example'
  readonly $name = OrderSomething.NAME
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
