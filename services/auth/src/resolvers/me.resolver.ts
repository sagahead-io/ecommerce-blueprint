import { Resolver, Query, Ctx, Authorized } from 'type-graphql'
import { ServiceContext } from '..'
import { Account } from '../entities/account.entity'
import { AuthAccountInfo } from '../types/authed-account.type'

@Resolver((_) => Account)
export class MeResolver {
  @Authorized()
  @Query(() => AuthAccountInfo, { nullable: true })
  async me(@Ctx() { authedAccount }: ServiceContext): Promise<AuthAccountInfo> {
    return authedAccount
  }
}
