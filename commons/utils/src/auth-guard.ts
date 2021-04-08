import { AuthChecker, ResolverData } from 'type-graphql'
import { AuthGuardContext, AuthGuardAuthedAccountData } from './types/auth-guard.type'

export const authGuard = async <T extends AuthGuardContext>(auth0Client): Promise<AuthChecker<T>> => {
  return new Promise((resolve) => {
    resolve(async ({ context }: ResolverData<T>, providedRoles?: string[]) => {
      const isAuthorized = !!context.req.headers['authorization']
      const token = context.req.headers['authorization'] && context.req.headers['authorization'].split('Bearer ')[1]

      if (!token) {
        console.error(`User has no authorization token`)
        return false
      }

      const roles = context.req.headers['x-roles'] ? context.req.headers['x-roles'].split(',') : []
      const id = context.req.headers['x-account-id']
      const auth0Id = context.req.headers['x-account-auth0-id']

      if (!isAuthorized || (providedRoles && providedRoles.length && !roles) || !id || !auth0Id) {
        console.error(`User is not authorized, roles not found or id, auth0id not found.`)
        return false
      }

      if (providedRoles && providedRoles.length && !roles.some((role: string) => providedRoles.includes(role))) {
        console.error(`Roles is required for this resource but user does not have required ones.`)
        return false
      }

      const authedAccount: AuthGuardAuthedAccountData = {
        id: +id || 0,
        auth0Id,
        roles,
        isAuthorized,
        token,
      }

      context.authedAccount = authedAccount

      return true
    })
  })
}
