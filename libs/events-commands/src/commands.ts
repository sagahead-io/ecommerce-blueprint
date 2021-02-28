import { Command } from '@node-ts/bus-messages'
import { PubSubAddress } from './addresses'

export class WorkflowsOrderCommand extends Command {
  readonly $name = `${PubSubAddress.Workflows}-example`
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
