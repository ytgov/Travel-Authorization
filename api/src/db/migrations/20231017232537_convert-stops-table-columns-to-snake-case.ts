import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("stops", (table) => {
    table.renameColumn("taid", "ta_id")
    table.renameColumn("locationId", "location_id")
    table.renameColumn("departureDate", "departure_date")
    table.renameColumn("departureTime", "departure_time")
    table.renameColumn("accommodationType", "accommodation_type")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("stops", (table) => {
    table.renameColumn("ta_id", "taid")
    table.renameColumn("location_id", "locationId")
    table.renameColumn("departure_date", "departureDate")
    table.renameColumn("departure_time", "departureTime")
    table.renameColumn("accommodation_type", "accommodationType")
  })
}
