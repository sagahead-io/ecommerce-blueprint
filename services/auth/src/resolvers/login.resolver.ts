import { Resolver, Arg, Mutation, Ctx } from 'type-graphql'
import { Account } from '../entities/account.entity'
import { LoginInput, LoginResponse } from '../types/login.type'
import { ServiceContext } from '..'
import { tryValidateAuth0Jwt, DecodedJwtData } from '@commons/utils'
import env from '../utils/env'
import { Auth0User } from '@commons/integrate-auth0'

@Resolver(Account)
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(@Ctx() ctx: ServiceContext, @Arg('input') inputData: LoginInput): Promise<LoginResponse> {
    let token: string

    if (inputData.accessToken) {
      token = inputData.accessToken
    } else {
      token = ctx.req.headers['authorization'] && ctx.req.headers['authorization'].split(' ')[1]
    }

    if (!token) {
      throw new Error('Login can not be performed as access token not provided.')
    }

    let auth0Decoded: DecodedJwtData
    let auth0Data: Auth0User

    try {
      auth0Decoded = await tryValidateAuth0Jwt(token, env.AUTH0_DOMAIN)
      auth0Data = await ctx.auth0Management.getUser({
        id: auth0Decoded.sub,
      })

      if (!auth0Data.user_id) {
        throw new Error('Auth0 data is saved not by this API, missing data')
      }

      if (!auth0Data.user_metadata || !auth0Data.user_metadata.id) {
        await createNewAccount(auth0Data, ctx)
      }
    } catch (e) {
      throw new Error(`Unable to create or update account in local database ${e}`)
    }

    return new LoginResponse(true)
  }
}

async function createNewAccount(
  { user_id, app_metadata }: Auth0User,
  { em, auth0Management, logger }: ServiceContext,
): Promise<void> {
  try {
    const account = em.create(Account, {
      auth0Id: user_id,
      auth0Roles: app_metadata && app_metadata.auth0Roles,
    })

    logger.info(`Account created ${account.id}`)

    await auth0Management.updateUser(
      { id: account.auth0Id },
      {
        user_metadata: { id: account.id },
        app_metadata: { auth0Roles: account.auth0Roles },
      },
    )
    logger.info(`Account id ${account.id} updated in user_metadata auth0`)
    await em.persistAndFlush(account)
    logger.info(`Account with ${account.id} persisted in database`)
  } catch (e) {
    throw new Error(`Unable to create account ${e}`)
  }
}
