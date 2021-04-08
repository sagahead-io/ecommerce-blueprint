import { Resolver, Mutation } from 'type-graphql'
import { randomBytes, createHash } from 'crypto'
import { LoginChallengeResponse } from '../types/login-challenge.type'
import { base64URLEncode } from '../utils/base64Encode'

@Resolver()
export class LoginChallengeResolver {
  @Mutation(() => LoginChallengeResponse)
  loginChallenge(): LoginChallengeResponse {
    const verifier = base64URLEncode(randomBytes(32))
    const challenge = base64URLEncode(createHash('sha256').update(verifier).digest())

    return new LoginChallengeResponse({
      verifier,
      challenge,
    })
  }
}
