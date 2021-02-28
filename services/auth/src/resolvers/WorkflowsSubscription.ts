import { Resolver, Mutation, Arg, Subscription, Root, PubSub, Ctx } from 'type-graphql'
import { WorkflowsExampleEvent, PubSubAddress } from '@libs/events-commands'
import {
  MessageAttributes,
  PubSubMessageBody,
  SNSSQSPubSubType,
  withCancel,
} from '@sagahead/graphql-snssqs-subscriptions'
import { Notification } from '../entities/Notification'
import { ServiceContext } from '..'
import { pubsub } from '../connectors/pubsub'

@Resolver()
export class WorkflowsSubscriptionResolver {
  @Mutation((_) => Boolean)
  async pubSubMutationToWorkflows(
    @PubSub() pubsub: SNSSQSPubSubType,
    @Ctx() { id }: ServiceContext,
    @Arg('message', { nullable: true })
    message?: string,
  ): Promise<boolean> {
    const busMsg = new WorkflowsExampleEvent(message || '')
    await pubsub.publish(
      busMsg.$name,
      busMsg,
      new MessageAttributes({
        correlationId: `${id}`,
      }),
    )
    return true
  }

  @Subscription(() => Notification, {
    subscribe: () =>
      withCancel(pubsub.asyncIterator(PubSubAddress.AuthSubscription), () => {
        console.log('With withCancel subscriptionFromWorkflows')
      }),
  })
  subscriptionFromWorkflows(@Root() data: PubSubMessageBody[]): Notification {
    const { domainMessage } = data[0]
    return {
      id: 1,
      message: domainMessage.message,
      date: new Date(),
    }
  }
}
