import * as dotenv from 'dotenv'

dotenv.config()

const {
  PORT,
  SERVICE,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  LOCAL_AWS_SNS_ENDPOINT,
  LOCAL_AWS_SQS_ENDPOINT,
} = process.env

export default {
  PORT: PORT || 8091,
  SERVICE: SERVICE || 'auth',
  SERVICE_DEVELOPMENT: process.env.NODE_ENV === 'development',
  AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: AWS_REGION || 'eu-central-1',
  LOCAL_AWS_SNS_ENDPOINT: LOCAL_AWS_SNS_ENDPOINT || 'http://localhost:4575',
  LOCAL_AWS_SQS_ENDPOINT: LOCAL_AWS_SQS_ENDPOINT || 'http://localhost:4576',
}
