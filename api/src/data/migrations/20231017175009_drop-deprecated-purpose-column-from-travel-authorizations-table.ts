import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table.dropColumn("purpose")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table.string("purpose", 255).nullable()
  })
}
