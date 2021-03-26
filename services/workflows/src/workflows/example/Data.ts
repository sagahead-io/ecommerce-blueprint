import { WorkflowData } from '@node-ts/bus-workflow'

export class ExampleWorkflowData extends WorkflowData {
  readonly $name = `ExampleWorkflowData`

  correlationId: string
  message: string

  constructor(message: string, correlationId: string) {
    super()
    this.message = message
    this.correlationId = correlationId
  }
}
