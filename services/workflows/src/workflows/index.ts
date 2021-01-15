import { ContainerModule } from 'inversify'
import { bindLogger } from '@node-ts/logger-core'
import { ExampleWorkflow } from './example/ExampleWorkflow'

export class WorkflowsModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bindLogger(bind, ExampleWorkflow)
    })
  }
}
