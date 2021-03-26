import { Resolver, Query } from 'type-graphql'
import { Hello } from './type'

@Resolver((_) => Hello)
export class TestResolver {
  @Query(() => Hello, { nullable: true })
  async hiFromTestResolver(): Promise<Hello> {
    return {
      id: 123,
      text: 'hello world',
    }
  }
}
