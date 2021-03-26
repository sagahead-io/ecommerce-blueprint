import { Resolver, Query, Mutation, Arg, Subscription, Root } from 'type-graphql'
import { Notification, NotificationPayload } from '../entities/Notification'
import {
  AuthSubscribeNotifications,
  AuthSubscribeNotifications2,
  AuthSubscribeEvents,
  StartExampleWorkflow,
} from '@commons/events-commands'
import { pubsub } from '../connectors/pubsub'
import { withCancel } from '@commons/amqp-subscriptions'

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
    await pubsub.publish(AuthSubscribeNotifications.NAME, payload)
    return true
  }

  @Mutation((_) => Boolean)
  async addEvent(
    @Arg('message', { nullable: true })
    message?: string,
  ): Promise<boolean> {
    const busMsg = new StartExampleWorkflow(message || '')
    await pubsub.publish(StartExampleWorkflow.NAME, busMsg)
    return true
  }

  @Subscription((_) => Notification, {
    subscribe: () =>
      withCancel(pubsub.asyncIterator(AuthSubscribeNotifications.NAME), () => {
        console.log('With withCancel subscriptionWithFilter')
      }),
  })
  subscribeNotifications(@Root() data: any) {
    console.log(data)
    const newNotification: Notification = { id: data.id, message: data.message, date: new Date() }
    return newNotification
  }

  @Subscription((_) => Notification, {
    subscribe: () =>
      withCancel(pubsub.asyncIterator(AuthSubscribeNotifications2.NAME), () => {
        console.log('With withCancel subscriptionWithFilter')
      }),
  })
  subscribeNotifications2(@Root() data: any) {
    console.log(data)
    const newNotification: Notification = { id: data.id, message: data.message, date: new Date() }
    return newNotification
  }

  @Subscription(() => Notification, {
    topics: AuthSubscribeEvents.NAME,
  })
  subscribeEvents(@Root() data: any): Notification {
    console.log(data)
    return {
      id: 1,
      message: data.message,
      date: new Date(),
    }
  }
}
