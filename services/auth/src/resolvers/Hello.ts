import { Resolver, Query, Ctx } from 'type-graphql'
import { Hello } from '../entities/Hello'
import { ContextType } from '../types/Context'

@Resolver((_) => Hello)
export class HelloResolver {
  @Query(() => Hello, { nullable: true })
  async hiFromAuth(@Ctx() ctx: ContextType): Promise<Hello> {
    console.log(ctx.contextData)
    return {
      id: 123,
      text: 'hello world auth',
    }
  }
}
