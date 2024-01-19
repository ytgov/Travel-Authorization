import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table.string("denial_reason", 2000).alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table.string("denial_reason", 255).alter()
  })
}
