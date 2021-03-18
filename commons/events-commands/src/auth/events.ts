import { Event } from '@node-ts/bus-messages'

export enum AUTH_ROUTING_KEYS {
  subscribeNotifications = '@services/auth/subscribeNotifications',
  subscribeNotifications2 = '@services/auth/subscribeNotifications2',
  subscribeEvents = '@services/auth/subscribeEvents',
}

export class AuthSubscribeNotifications extends Event {
  readonly $name = AUTH_ROUTING_KEYS.subscribeNotifications
  readonly $version = 1
}

export class AuthSubscribeNotifications2 extends Event {
  readonly $name = AUTH_ROUTING_KEYS.subscribeNotifications2
  readonly $version = 1
}

export class AuthSubscribeEvents extends Event {
  readonly $name = AUTH_ROUTING_KEYS.subscribeEvents
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
