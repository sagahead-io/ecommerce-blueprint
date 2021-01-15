import * as dotenv from 'dotenv'

dotenv.config()

const { PORT, SERVICE } = process.env

export default {
  PORT: PORT || 8091,
  SERVICE: SERVICE || 'auth',
}
