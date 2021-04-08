export interface AuthGuardReqWithHeaders {
  headers: any
  [key: string]: any
}

export interface AuthGuardAuthedAccountData {
  id: number
  auth0Id: string
  roles: string[]
  isAuthorized: boolean
  token: string
}

export type AuthGuardAuthedAccount = Omit<AuthGuardAuthedAccountData, 'token'>

export interface AuthGuardContext {
  req: AuthGuardReqWithHeaders
  authedAccount: AuthGuardAuthedAccount
}
