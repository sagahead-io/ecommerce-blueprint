import { MikroORM } from '@mikro-orm/core'
import ormConfig from './src/orm.config'
;(async () => {
  try {
    const orm = await MikroORM.init(ormConfig)
    const migrator = orm.getMigrator()

    if (process.argv[2] === 'create') {
      await migrator.createMigration()
    }

    if (process.argv[2] === 'up') {
      await migrator.up()
    }

    if (process.argv[2] === 'down') {
      await migrator.down()
    }

    await orm.close(true)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
