import * as dotenv from 'dotenv'
import { assertedVar, envToArray, unslash } from '@commons/utils'
import { Auth0InstallAppCallbacks } from '@commons/integrate-auth0'

dotenv.config()

const {
  PORT,
  SERVICE,
  AUTH0_CLIENT,
  AUTH0_SECRET,
  AUTH0_DOMAIN,
  AUTH0_ADMINS,
  AUTH0_FRONTEND_URL,
  AUTH0_LOGIN_ENDPOINT,
  AUTH0_LOGOUT_ENDPOINT,
  AMQP_CONNECTION_STR,
} = process.env

export default {
  PORT: PORT || 8091,
  SERVICE: SERVICE || 'auth',
  SERVICE_DEVELOPMENT: process.env.NODE_ENV === 'development',
  SERVICE_EXCHANGE: `@services/${SERVICE || 'auth'}`,

  AUTH0_CLIENT: assertedVar(AUTH0_CLIENT),
  AUTH0_SECRET: assertedVar(AUTH0_SECRET),
  AUTH0_DOMAIN: assertedVar(AUTH0_DOMAIN),
  AUTH0_ADMINS: envToArray(assertedVar(AUTH0_ADMINS)),
  AUTH0_CONNECTION: 'Username-Password-Authentication',
  AUTH0_FRONTEND_URL: AUTH0_FRONTEND_URL || 'http://localhost:3000',
  AUTH0_LOGIN_ENDPOINT: unslash(AUTH0_LOGIN_ENDPOINT) || 'login',
  AUTH0_LOGOUT_ENDPOINT: unslash(AUTH0_LOGOUT_ENDPOINT) || 'logout',
  AUTH0_CALLBACKS: {
    callbacks: [`${AUTH0_FRONTEND_URL}`, `${AUTH0_FRONTEND_URL}/${AUTH0_LOGIN_ENDPOINT}`],
    allowed_logout_urls: [`${AUTH0_FRONTEND_URL}`, `${AUTH0_FRONTEND_URL}/${AUTH0_LOGOUT_ENDPOINT}`],
    web_origins: [`${AUTH0_FRONTEND_URL}`],
    allowed_origins: [`${AUTH0_FRONTEND_URL}`],
  } as Auth0InstallAppCallbacks,

  AMQP_CONNECTION_STR: AMQP_CONNECTION_STR || 'amqp://guest:guest@localhost:5672?heartbeat=30',
}
