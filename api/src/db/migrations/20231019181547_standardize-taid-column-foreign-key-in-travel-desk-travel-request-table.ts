import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_requests", async (table) => {
    table.dropForeign(["TAID"])
    table.renameColumn("TAID", "travel_authorization_id")
    table
      .foreign("travel_authorization_id")
      .references("id")
      .inTable("travel_authorizations")
      .onDelete("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_requests", async (table) => {
    table.dropForeign(["travel_authorization_id"])
    table.renameColumn("travel_authorization_id", "TAID")
    table.foreign("TAID").references("id").inTable("travel_authorizations").onDelete("CASCADE")
  })
}
