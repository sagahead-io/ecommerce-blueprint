import { Resolver, Query, Ctx } from 'type-graphql'
import { ServiceContext } from '..'
import { Hello } from '../test-entities/Hello'

@Resolver((_) => Hello)
export class HelloResolver {
  @Query(() => Hello, { nullable: true })
  async hiFromAuth(@Ctx() ctx: ServiceContext): Promise<Hello> {
    console.log(ctx['testas'])
    return {
      id: 123,
      text: 'hello world auth',
    }
  }

  @Query(() => Hello, { nullable: true })
  async testas(@Ctx() ctx: ServiceContext): Promise<Hello> {
    console.log(ctx)
    return {
      id: 123,
      text: 'testas',
    }
  }
}
