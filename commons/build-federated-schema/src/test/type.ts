import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Hello {
  @Field(() => ID)
  readonly id!: number

  @Field()
  text!: string
}
