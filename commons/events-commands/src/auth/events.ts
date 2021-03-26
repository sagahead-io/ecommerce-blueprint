import { Event } from '@node-ts/bus-messages'

export class AuthSubscribeNotifications extends Event {
  static NAME = '@services/auth/subscribeNotifications'
  readonly $name = AuthSubscribeNotifications.NAME
  readonly $version = 1
}

export class AuthSubscribeNotifications2 extends Event {
  static NAME = '@services/auth/subscribeNotifications2'
  readonly $name = AuthSubscribeNotifications2.name
  readonly $version = 1
}

export class AuthSubscribeEvents extends Event {
  static NAME = '@services/auth/subscribeEvents'
  readonly $name = AuthSubscribeEvents.NAME
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
