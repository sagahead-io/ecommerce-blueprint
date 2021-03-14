import * as dotenv from 'dotenv'

dotenv.config()

const { PORT, SERVICE } = process.env

export default {
  PORT: PORT || 8091,
  SERVICE: SERVICE || 'auth',
  SERVICE_DEVELOPMENT: process.env.NODE_ENV === 'development',
  SERVICE_EXCHANGE: `@services/${SERVICE || 'auth'}`,
}
