import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_passenger_name_record_documents", (table) => {
    // Fix foreign key name on travel_desk_travel_request_id
    // It truncated the trailing part, so the unique and foreign key constraint names were the same
    // Max constraint name length is 63 characters, and Postgres supposed to chop out the middle,
    // but it looks like Knex is chopping off the end instead.
    table.dropForeign(["travel_desk_travel_request_id"])
    table
      .foreign(
        "travel_desk_travel_request_id",
        "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
      )
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")

    table.unique(["travel_desk_travel_request_id"], {
      indexName: "travel_desk_pnr_documents_travel_desk_travel_request_id_unique",
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_passenger_name_record_documents", (table) => {
    table.dropForeign(
      ["travel_desk_travel_request_id"],
      "travel_desk_pnr_documents_travel_desk_travel_request_id_foreign"
    )
    table
      .foreign("travel_desk_travel_request_id")
      .references("requestID")
      .inTable("travelDeskTravelRequest")
      .onDelete("CASCADE")

    table.dropUnique(
      ["travel_desk_travel_request_id"],
      "travel_desk_pnr_documents_travel_desk_travel_request_id_unique"
    )
  })
}
