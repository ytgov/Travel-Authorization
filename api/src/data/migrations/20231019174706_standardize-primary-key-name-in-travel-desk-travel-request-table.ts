import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("travelDeskFlightRequest", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskRentalCar", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskHotel", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskOtherTransportation", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskQuestion", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travel_desk_passenger_name_record_documents", (table) => {
    table.dropForeign(
      ["travel_desk_travel_request_id"],
      "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
    )
  })

  // START: Core table changes
  await knex.schema.table("travel_desk_travel_requests", async (table) => {
    table.dropPrimary()
    table.renameColumn("requestID", "id")
    table.primary(["id"])
  })
  await knex.raw(
    'ALTER SEQUENCE "travel_desk_travel_requests_requestID_seq" RENAME TO "travel_desk_travel_requests_id_seq"'
  )
  // END: Core table changes

  await knex.schema.table("travelDeskFlightRequest", (table) => {
    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskRentalCar", (table) => {
    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskHotel", (table) => {
    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskOtherTransportation", (table) => {
    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskQuestion", (table) => {
    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travel_desk_passenger_name_record_documents", (table) => {
    table
      .foreign(
        "travel_desk_travel_request_id",
        "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
      )
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("travelDeskFlightRequest", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskRentalCar", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskHotel", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskOtherTransportation", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travelDeskQuestion", (table) => {
    table.dropForeign(["requestID"])
  })
  await knex.schema.table("travel_desk_passenger_name_record_documents", (table) => {
    table.dropForeign(
      ["travel_desk_travel_request_id"],
      "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
    )
  })

  // START: Core table changes
  await knex.schema.table("travel_desk_travel_requests", async (table) => {
    table.dropPrimary()
    table.renameColumn("id", "requestID")
    table.primary(["requestID"])
  })
  await knex.raw(
    'ALTER SEQUENCE "travel_desk_travel_requests_id_seq" RENAME TO "travel_desk_travel_requests_requestID_seq"'
  )
  // END: Core table changes

  await knex.schema.table("travelDeskFlightRequest", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskRentalCar", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskHotel", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskOtherTransportation", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskQuestion", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travel_desk_passenger_name_record_documents", (table) => {
    table
      .foreign(
        "travel_desk_travel_request_id",
        "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
      )
      .references("requestID")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })
}
