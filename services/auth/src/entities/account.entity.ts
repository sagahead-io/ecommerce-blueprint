import { Entity, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { Base } from './base.entity'
import { AccountValidator } from '../contracts/validators/account.contract'

@ObjectType()
@Entity()
export class Account extends Base<Account> {
  @Field()
  @Property({ nullable: true })
  auth0Id!: string

  @Field(() => [String], { nullable: true })
  @Property({ nullable: true })
  auth0Roles?: string[]

  constructor(body: AccountValidator) {
    super(body)
  }
}
