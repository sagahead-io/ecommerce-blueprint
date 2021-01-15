import { Event } from '@node-ts/bus-messages'
import { Uuid } from '../../configs/types'
import env from '../../utils/env'

export class ExampleEvent extends Event {
  readonly $name = `${env.SERVICE}/example-event`
  readonly $version = 1

  correlationId: Uuid

  constructor(correlationId: Uuid) {
    super()
    this.correlationId = correlationId
  }
}
