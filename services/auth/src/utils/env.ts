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
  AUTH0_ADMIN_FRONTEND_URL,
  AUTH0_LOGIN_ENDPOINT,
  AUTH0_LOGOUT_ENDPOINT,
  AMQP_CONNECTION_STR,
} = process.env

const ADMIN_FRONTEND_URL = AUTH0_ADMIN_FRONTEND_URL || 'http://localhost:3001'
const FRONTEND_URL = AUTH0_FRONTEND_URL || 'http://localhost:3000'
const LOGIN_ENDPOINT = unslash(AUTH0_LOGIN_ENDPOINT) || 'login'
const LOGOUT_ENDPOINT = unslash(AUTH0_LOGOUT_ENDPOINT) || 'logout'

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
  AUTH0_FRONTEND_URL: FRONTEND_URL,
  AUTH0_LOGIN_ENDPOINT: LOGIN_ENDPOINT,
  AUTH0_LOGOUT_ENDPOINT: LOGOUT_ENDPOINT,
  AUTH0_CONFIG: {
    callbacks: [
      `${FRONTEND_URL}`,
      `${ADMIN_FRONTEND_URL}`,
      `${ADMIN_FRONTEND_URL}/${LOGIN_ENDPOINT}`,
      `${FRONTEND_URL}/${LOGIN_ENDPOINT}`,
    ],
    allowed_logout_urls: [
      `${FRONTEND_URL}`,
      `${ADMIN_FRONTEND_URL}`,
      `${ADMIN_FRONTEND_URL}/${LOGOUT_ENDPOINT}`,
      `${FRONTEND_URL}/${LOGOUT_ENDPOINT}`,
    ],
    web_origins: [`${FRONTEND_URL}`, `${ADMIN_FRONTEND_URL}`],
    allowed_origins: [`${FRONTEND_URL}`, `${ADMIN_FRONTEND_URL}`],
    oidc_conformant: true,
    jwt_configuration: {
      alg: 'RS256',
    },
  } as Auth0InstallAppCallbacks,

  AMQP_CONNECTION_STR: AMQP_CONNECTION_STR || 'amqp://guest:guest@localhost:5672?heartbeat=30',
}
