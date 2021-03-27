import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core'
import ormConfig from '../orm.config'

export type OrmConnectionType = MikroORM<IDatabaseDriver<Connection>>

export async function openConnection(): Promise<OrmConnectionType> {
  let orm: OrmConnectionType

  try {
    orm = await MikroORM.init(ormConfig)
    const migrator = orm.getMigrator()
    const migrations = await migrator.getPendingMigrations()
    console.log(migrations)
    if (migrations && migrations.length > 0) {
      await migrator.up()
    }
  } catch (error) {
    console.error('Could not connect to the database', error)
    throw Error(error)
  }

  return orm
}
