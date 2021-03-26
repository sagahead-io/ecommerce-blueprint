import { Workflow, StartedBy } from '@node-ts/bus-workflow'
import { injectable, inject } from 'inversify'
import { ExampleWorkflowData } from './Data'
import { LOGGER_SYMBOLS, Logger } from '@node-ts/logger-core'
import { BUS_SYMBOLS, Bus } from '@node-ts/bus-core'
import { MessageAttributes } from '@node-ts/bus-messages'
import { StartExampleWorkflow, AuthSubscribeEvents } from '@commons/events-commands'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
@injectable()
export class ExampleWorkflow extends Workflow<ExampleWorkflowData> {
  constructor(
    @inject(BUS_SYMBOLS.Bus) private readonly bus: Bus,
    @inject(LOGGER_SYMBOLS.Logger) private readonly logger: Logger,
  ) {
    super()
  }

  /**
   * Starts new Example workflow
   */
  @StartedBy<StartExampleWorkflow, ExampleWorkflowData, 'handleExampleWorkflow'>(StartExampleWorkflow)
  async handleExampleWorkflow(
    event: StartExampleWorkflow,
    _: ExampleWorkflowData,
    { correlationId }: MessageAttributes,
  ): Promise<Partial<ExampleWorkflowData>> {
    this.logger.info('Example worklfow started')

    const { message } = event

    const reply = `Message that was received test from WorkflowsExampleEvent was ${message} with ${correlationId}`
    await sleep(2000)
    this.bus.publish(new AuthSubscribeEvents(reply))

    return {
      message: reply,
      correlationId,
    }
  }
}
