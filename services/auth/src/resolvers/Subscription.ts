import { Resolver, Query, Mutation, Arg, Subscription, Root, PubSub } from 'type-graphql'
import { Notification, NotificationPayload } from '../entities/Notification'
import { PubSubAddress } from '@libs/events-commands'
import { PubSubMessageBody, SNSSQSPubSub, withCancel } from '@sagahead/graphql-snssqs-subscriptions'
import { pubsub } from '../connectors/pubsub'

@Resolver()
export class SubscriptionResolver {
  private autoIncrement = 0

  @Query((_) => Date)
  currentDate() {
    return new Date()
  }

  @Mutation((_) => Boolean)
  async pubSubMutation(
    @PubSub() pubsub: SNSSQSPubSub,
    @Arg('message', { nullable: true }) message?: string,
  ): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message }
    await pubsub.publish(PubSubAddress.Auth, payload)
    return true
  }

  // @Subscription(() => Notification, { topics: PubSubAddress.Auth })
  // normalSubscription(@Root() data: PubSubMessageBody[]): Notification {
  //   const { domainMessage } = data[0]
  //   return { id: domainMessage.id, message: domainMessage.message, date: new Date() }
  // }

  @Subscription((_) => Notification, {
    subscribe: () =>
      withCancel(pubsub.asyncIterator(PubSubAddress.Auth), () => {
        console.log('With withCancel subscriptionWithFilter')
      }),
  })
  subscriptionWithFilter(@Root() data: PubSubMessageBody[]) {
    const newNotification: Notification = { id: 1, message: data[0].domainMessage.message, date: new Date() }
    return newNotification
  }
}
