import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Notification {
  @Field((_) => ID)
  id!: number

  @Field({ nullable: true })
  message?: string

  @Field((_) => Date)
  date!: Date
}

export interface NotificationPayload {
  id: number
  message?: string
}
