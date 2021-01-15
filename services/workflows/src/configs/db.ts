import { PostgresConfiguration } from '@node-ts/bus-postgres'
import env from '../utils/env'

export const dbConfiguration: PostgresConfiguration = {
  connection: {
    connectionString: `postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}:${env.PGPORT}`,
  },
  schemaName: env.PGDATABASE,
}
