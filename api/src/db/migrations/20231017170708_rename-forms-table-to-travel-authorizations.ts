import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("forms", "travel_authorizations")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("travel_authorizations", "forms")
}
