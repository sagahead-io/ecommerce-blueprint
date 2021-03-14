import { Command } from '@node-ts/bus-messages'
export class OrderSomething extends Command {
  readonly $name = `workflows_order_something`
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
