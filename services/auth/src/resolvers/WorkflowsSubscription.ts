import { Resolver, Mutation, Arg, Subscription, Root } from 'type-graphql'
import { WorkflowsExampleEvent, PubSubAddress } from '@libs/events-commands'
import { Notification } from '../entities/Notification'
import { pubsub } from '../connectors/pubsub'

@Resolver()
export class WorkflowsSubscriptionResolver {
  @Mutation((_) => Boolean)
  async pubSubMutationToWorkflows(
    @Arg('message', { nullable: true })
    message?: string,
  ): Promise<boolean> {
    const busMsg = new WorkflowsExampleEvent(message || '')
    await pubsub.publish(busMsg.$name, busMsg)
    return true
  }

  @Subscription(() => Notification, {
    topics: PubSubAddress.AuthSubscription,
  })
  subscriptionFromWorkflows(@Root() data: any): Notification {
    const { domainMessage } = data[0]
    return {
      id: 1,
      message: domainMessage.message,
      date: new Date(),
    }
  }
}
