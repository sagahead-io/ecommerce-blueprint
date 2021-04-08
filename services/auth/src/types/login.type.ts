import { InputType, ObjectType, Field } from 'type-graphql'

@InputType()
export class LoginInput {
  @Field(() => String, { defaultValue: null, nullable: true })
  accessToken!: string
}

@ObjectType()
export class LoginResponse {
  @Field(() => Boolean)
  loggedIn: boolean

  constructor(loggedIn: boolean) {
    this.loggedIn = loggedIn
  }
}
