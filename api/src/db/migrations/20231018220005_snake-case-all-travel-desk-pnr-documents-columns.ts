import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_passenger_name_record_documents", async (table) => {
    table.dropForeign(["requestID"])
    table.renameColumn("requestID", "travel_desk_travel_request_id")
    table
      .foreign("travel_desk_travel_request_id")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")

    table.renameColumn("pnrDocument", "pnr_document")
    table.renameColumn("invoiceNumber", "invoice_number")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_passenger_name_record_documents", async (table) => {
    table.dropForeign(["travel_desk_travel_request_id"])
    table.renameColumn("travel_desk_travel_request_id", "requestID")
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")

    table.renameColumn("pnr_document", "pnrDocument")
    table.renameColumn("invoice_number", "invoiceNumber")
  })
}
