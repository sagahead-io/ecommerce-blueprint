import { Event } from '@node-ts/bus-messages'
import { PubSubAddress } from './addresses'

export class AuthSubscriptionExampleEvent extends Event {
  readonly $name = `${PubSubAddress.AuthSubscription}`
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}

export class WorkflowsExampleEvent extends Event {
  readonly $name = `${PubSubAddress.Workflows}-example`
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
