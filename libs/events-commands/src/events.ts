import { Event } from '@node-ts/bus-messages'
export class StartExampleWorkflow extends Event {
  readonly $name = `workflows_example_event`
  readonly $version = 1

  message: string

  constructor(message: string) {
    super()
    this.message = message
  }
}
