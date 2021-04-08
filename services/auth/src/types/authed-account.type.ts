import { Field, ObjectType } from 'type-graphql'
import { AuthGuardAuthedAccount } from '@commons/utils'

@ObjectType()
export class AuthAccountInfo implements AuthGuardAuthedAccount {
  @Field()
  id!: number

  @Field()
  auth0Id!: string

  @Field(() => [String])
  roles!: string[]

  @Field()
  isAuthorized!: boolean
}
