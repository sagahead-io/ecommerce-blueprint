import { Migration } from '@mikro-orm/migrations'
import env from '../utils/env'
import { setupAuth0Clients, installAuth0Apps, installAuth0Roles } from '@commons/integrate-auth0'

export class Migration20210327090939 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "account" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "auth0id" varchar(255) null, "auth0roles" text[] null);',
    )
    this.addSql('alter table "account" add constraint "account_pkey" primary key ("id");')

    await setupAuth0Clients({
      clientId: env.AUTH0_CLIENT,
      clientSecret: env.AUTH0_SECRET,
      domain: env.AUTH0_DOMAIN,
    })
    await installAuth0Apps(env.AUTH0_CALLBACKS)
    await installAuth0Roles(env.AUTH0_ADMINS)
  }

  async down(): Promise<void> {
    this.addSql(`alter table "account" drop constraint "account_pkey"`)
    this.addSql(`drop table "account"`)
  }
}
