import { Workflow, StartedBy } from '@node-ts/bus-workflow'
import { injectable, inject } from 'inversify'
import { ExampleWorkflowData } from './Data'
import { ExampleEvent } from './Events'
import { LOGGER_SYMBOLS, Logger } from '@node-ts/logger-core'
// import { BUS_SYMBOLS, Bus } from '@node-ts/bus-core'
import { MessageAttributes } from '@node-ts/bus-messages'

@injectable()
export class ExampleWorkflow extends Workflow<ExampleWorkflowData> {
  constructor(
    // @inject(BUS_SYMBOLS.Bus) private readonly bus: Bus,
    @inject(LOGGER_SYMBOLS.Logger) private readonly logger: Logger,
  ) {
    super()
  }

  /**
   * Starts new Example workflow
   */
  @StartedBy<ExampleEvent, ExampleWorkflowData, 'handleExampleWorkflow'>(ExampleEvent)
  async handleExampleWorkflow(
    event: ExampleEvent,
    _: ExampleWorkflowData,
    messageAttributes: MessageAttributes,
  ): Promise<Partial<ExampleWorkflowData>> {
    this.logger.info('Example worklfow started')

    const { correlationId } = event

    console.log(correlationId)

    return {
      correlationId: messageAttributes.correlationId,
    }
  }
}
