import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travelDeskPnrDocuments", async (table) => {
    table.dropPrimary()
    table.dropForeign(["requestID"])
  })

  await knex.schema.renameTable(
    "travelDeskPnrDocuments",
    "travel_desk_passenger_name_record_documents"
  )

  await knex.schema.alterTable("travel_desk_passenger_name_record_documents", async (table) => {
    table.primary(["documentID"])
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })

  await knex.raw(
    `ALTER SEQUENCE "travelDeskPnrDocuments_documentID_seq" RENAME TO "travel_desk_passenger_name_record_documents_documentID_seq"`
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_passenger_name_record_documents", async (table) => {
    table.dropPrimary()
    table.dropForeign(["requestID"])
  })

  await knex.schema.renameTable(
    "travel_desk_passenger_name_record_documents",
    "travelDeskPnrDocuments"
  )

  await knex.schema.alterTable("travelDeskPnrDocuments", async (table) => {
    table.primary(["documentID"])
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })

  await knex.raw(
    `ALTER SEQUENCE "travel_desk_passenger_name_record_documents_documentID_seq" RENAME TO "travelDeskPnrDocuments_documentID_seq"`
  )
}
