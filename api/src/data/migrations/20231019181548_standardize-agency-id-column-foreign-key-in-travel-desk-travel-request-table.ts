import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("travel_desk_travel_requests", async (table) => {
    table.dropForeign(["agencyID"])
    table.renameColumn("agencyID", "travel_desk_travel_agent_id")
    table
      .foreign("travel_desk_travel_agent_id")
      .references("agencyID")
      .inTable("travelDeskTravelAgent")
      .onDelete("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("travel_desk_travel_requests", async (table) => {
    table.dropForeign(["travel_desk_travel_agent_id"])
    table.renameColumn("travel_desk_travel_agent_id", "agencyID")
    table
      .foreign("agencyID")
      .references("agencyID")
      .inTable("travelDeskTravelAgent")
      .onDelete("CASCADE")
  })
}
