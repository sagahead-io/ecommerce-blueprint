import { WorkflowData } from '@node-ts/bus-workflow'
import { Uuid } from '../../configs/types'
import env from '../../utils/env'

export class ExampleWorkflowData extends WorkflowData {
  readonly $name = `${env.SERVICE}/example-workflow-data`

  correlationId!: Uuid
}
