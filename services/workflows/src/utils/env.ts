import * as dotenv from 'dotenv'

dotenv.config()

const {
  PORT,
  SERVICE,
  AWS_ACCOUNT_ID,
  AWS_SQS_ENDPOINT,
  AWS_SNS_ENDPOINT,
  AWS_REGION,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGPORT,
  PGHOST,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env

process.env.AWS_REGION = AWS_REGION || 'eu-central-1'
process.env.AWS_ACCOUNT_ID = AWS_ACCOUNT_ID || '000000000000'

export default {
  PORT: PORT || 8092,
  SERVICE: SERVICE || 'workflows',
  SERVICE_DEVELOPMENT: process.env.NODE_ENV === 'development',

  // aws
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  AWS_REGION: process.env.AWS_REGION,
  AWS_SQS_ENDPOINT: AWS_SQS_ENDPOINT || 'http://0.0.0.0:4576',
  AWS_SNS_ENDPOINT: AWS_SNS_ENDPOINT || 'http://0.0.0.0:4575',
  AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY || '',

  // database
  PGDATABASE: PGDATABASE || 'workflows',
  PGUSER: PGUSER || 'root',
  PGPASSWORD: PGPASSWORD || 'root',
  PGPORT: PGPORT || '5432',
  PGHOST: PGHOST || '0.0.0.0',
}
