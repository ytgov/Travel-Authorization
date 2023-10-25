import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("stops", (table) => {
    table.renameColumn("ta_id", "travel_authorization_id")
    table
      .foreign("travel_authorization_id")
      .references("id")
      .inTable("travel_authorizations")
      .onDelete("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("stops", (table) => {
    table.dropForeign("travel_authorization_id")
    table.renameColumn("travel_authorization_id", "ta_id")
  })
}
