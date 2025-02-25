import { Knex } from "knex"

import logger from "@/utils/logger"

export async function up(knex: Knex): Promise<void> {
  logger.warn("Running irriversible migration that wipes all flight reconciliations")

  await knex.raw(/* sql */ `TRUNCATE TABLE flight_reconciliations RESTART IDENTITY CASCADE`)

  await knex.schema.alterTable("flight_reconciliations", (table) => {
    table.datetime("invoice_booking_date").nullable()
    table.string("invoice_department", 255).nullable()
    table.decimal("invoice_detail_selling_fare", 19, 4).notNullable()
    table.string("invoice_detail_computed_agent_name", 255).nullable()
    table.string("invoice_detail_vendor_name", 255).notNullable()
    table.string("invoice_detail_computed_traveler_first_name", 255).notNullable()
    table.string("invoice_detail_computed_traveler_last_name", 255).notNullable()
    table.text("segments_computed_flight_info").nullable()
    table.string("segments_computed_final_destination", 255).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("flight_reconciliations", (table) => {
    table.dropColumn("invoice_booking_date")
    table.dropColumn("invoice_department")
    table.dropColumn("invoice_detail_selling_fare")
    table.dropColumn("invoice_detail_computed_agent_name")
    table.dropColumn("invoice_detail_vendor_name")
    table.dropColumn("invoice_detail_computed_traveler_first_name")
    table.dropColumn("invoice_detail_computed_traveler_last_name")
    table.dropColumn("segments_computed_flight_info")
    table.dropColumn("segments_computed_final_destination")
  })
}
