import { Migration } from '@mikro-orm/migrations'
import { installAuth0Apps, installAuth0Roles, uninstallAuth0Roles, uninstallAuth0Apps } from '@commons/integrate-auth0'
import { initAuth0 } from '../connectors/auth0'
import env from '../utils/env'
export class Migration20210327090939 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "account" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "auth0id" varchar(255) null, "auth0roles" text[] null);',
    )
    this.addSql('alter table "account" add constraint "account_pkey" primary key ("id");')

    await initAuth0()
    await installAuth0Apps(env.AUTH0_CONFIG)
    await installAuth0Roles(env.AUTH0_ADMINS)
  }

  async down(): Promise<void> {
    this.addSql(`alter table "account" drop constraint "account_pkey"`)
    this.addSql(`drop table "account"`)

    await initAuth0()
    await uninstallAuth0Apps(env.AUTH0_CONFIG)
    await uninstallAuth0Roles()
  }
}
