import { Resolver, Query, Mutation, Arg, Subscription, Root } from 'type-graphql'
import { Notification, NotificationPayload } from '../entities/Notification'
import { PubSubAddress } from '@libs/events-commands'
import { pubsub } from '../connectors/pubsub'
import { withCancel } from '../utils/withCancel'

@Resolver()
export class NotificationResolver {
  private autoIncrement = 0

  @Query((_) => Date)
  currentDate() {
    return new Date()
  }

  @Mutation((_) => Boolean)
  async addNotification(@Arg('message', { nullable: true }) message?: string): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message }
    await pubsub.publish(PubSubAddress.Auth, payload)
    return true
  }

  @Mutation((_) => Boolean)
  async addEvent(
    @Arg('message', { nullable: true })
    message?: string,
  ): Promise<boolean> {
    const busMsg = new WorkflowsExampleEvent(message || '')
    console.log(busMsg.$name)
    await pubsub.publish(busMsg.$name, busMsg)
    return true
  }

  @Subscription((_) => Notification, {
    subscribe: () =>
      withCancel(pubsub.asyncIterator(PubSubAddress.Auth), () => {
        console.log('With withCancel subscriptionWithFilter')
      }),
  })
  subscribeNotifications(@Root() data: any) {
    console.log(data)
    const newNotification: Notification = { id: 1, message: data.message, date: new Date() }
    return newNotification
  }

  @Subscription(() => Notification, {
    topics: PubSubAddress.AuthSubscription,
  })
  subscribeEvents(@Root() data: any): Notification {
    const { domainMessage } = data
    return {
      id: 1,
      message: domainMessage.message,
      date: new Date(),
    }
  }
}
