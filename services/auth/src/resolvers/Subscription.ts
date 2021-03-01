import { Resolver, Query, Mutation, Arg, Subscription, Root } from 'type-graphql'
import { Notification, NotificationPayload } from '../entities/Notification'
import { PubSubAddress } from '@libs/events-commands'
import { pubsub } from '../connectors/pubsub'

export function withCancel<T>(
  asyncIterator: AsyncIterator<T | undefined>,
  onCancel: () => void,
): AsyncIterator<T | undefined> {
  if (!asyncIterator.return) {
    asyncIterator.return = () => Promise.resolve({ value: undefined, done: true })
  }

  const savedReturn = asyncIterator.return.bind(asyncIterator)
  asyncIterator.return = () => {
    onCancel()
    return savedReturn()
  }

  return asyncIterator
}

@Resolver()
export class SubscriptionResolver {
  private autoIncrement = 0

  @Query((_) => Date)
  currentDate() {
    return new Date()
  }

  @Mutation((_) => Boolean)
  async pubSubMutation(@Arg('message', { nullable: true }) message?: string): Promise<boolean> {
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
  subscriptionWithFilter(@Root() data: any) {
    console.log(data)
    const newNotification: Notification = { id: 1, message: data.message, date: new Date() }
    return newNotification
  }
}
