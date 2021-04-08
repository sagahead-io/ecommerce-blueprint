import { ObjectType, Field } from 'type-graphql'
import { IsBase64 } from 'class-validator'

@ObjectType()
export class LoginChallengeResponse {
  @Field()
  @IsBase64()
  verifier: string

  @Field()
  @IsBase64()
  challenge: string

  constructor(data: LoginChallengeResponse) {
    this.verifier = data.verifier
    this.challenge = data.challenge
  }
}
