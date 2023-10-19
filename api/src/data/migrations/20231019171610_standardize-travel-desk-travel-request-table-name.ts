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
  await knex.schema.table("travelDeskTravelRequest", async (table) => {
    table.dropPrimary()
    table.dropForeign(["TAID"])
    table.dropForeign(["agencyID"])
  })

  await knex.schema.renameTable("travelDeskTravelRequest", "travel_desk_travel_requests")

  await knex.schema.table("travel_desk_travel_requests", async (table) => {
    table.primary(["requestID"])
    table.foreign("TAID").references("id").inTable("travel_authorizations").onDelete("CASCADE")
    table
      .foreign("agencyID")
      .references("agencyID")
      .inTable("travelDeskTravelAgent")
      .onDelete("SET NULL")
  })

  await knex.raw(
    `ALTER SEQUENCE "travelDeskTravelRequest_requestID_seq" RENAME TO "travel_desk_travel_requests_requestID_seq"`
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
    table.dropForeign(["TAID"])
    table.dropForeign(["agencyID"])
  })

  await knex.schema.renameTable("travel_desk_travel_requests", "travelDeskTravelRequest")

  await knex.schema.table("travelDeskTravelRequest", async (table) => {
    table.primary(["requestID"])
    table.foreign("TAID").references("id").inTable("travel_authorizations").onDelete("CASCADE")
    table
      .foreign("agencyID")
      .references("agencyID")
      .inTable("travelDeskTravelAgent")
      .onDelete("SET NULL")
  })

  await knex.raw(
    `ALTER SEQUENCE "travel_desk_travel_requests_requestID_seq" RENAME TO "travelDeskTravelRequest_requestID_seq"`
  )
  // END: Core table changes

  await knex.schema.table("travelDeskFlightRequest", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskRentalCar", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskHotel", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskOtherTransportation", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travelDeskQuestion", (table) => {
    table
      .foreign("requestID")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })
  await knex.schema.table("travel_desk_passenger_name_record_documents", (table) => {
    table
      .foreign(
        "travel_desk_travel_request_id",
        "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
      )
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")
  })
}
