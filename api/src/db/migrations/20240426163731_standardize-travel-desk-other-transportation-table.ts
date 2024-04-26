import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_desk_other_transportations", (table) => {
    table.increments("id").primary()
    table.integer("travel_request_id").unsigned().notNullable()

    table.string("depart").notNullable()
    table.string("arrive").notNullable()
    table.string("transportation_type").notNullable()
    table.date("date").notNullable()
    table.string("additional_notes")
    table.string("status").notNullable()

    // NOTE: reserved_transportation_info, and booking do not appear to be used in the codebase.
    table.string("reserved_transportation_info")
    table.string("booking")

    table.timestamps(true, true)
    table.timestamp("deleted_at")

    table
      .foreign("travel_request_id")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO travel_desk_other_transportations (
      id,
      travel_request_id,
      depart,
      arrive,
      transportation_type,
      "date",
      additional_notes,
      "status",
      reserved_transportation_info,
      booking
    )
    SELECT
      "transportationID" AS id,
      "requestID" AS travel_request_id,
      depart,
      arrive,
      "transportationType" AS transportation_type,
      "date",
      "additionalNotes",
      "status",
      "reservedTranspInfo" AS reserved_transportation_info,
      booking
    FROM
      "travelDeskOtherTransportation"
  `)

  await knex.schema.dropTable("travelDeskOtherTransportation")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("travelDeskOtherTransportation", function (t) {
    t.increments("transportationID").notNullable().primary()
    t.integer("requestID").unsigned().notNullable()
    t.foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")

    t.string("depart").notNullable()
    t.string("arrive").notNullable()

    t.string("transportationType")

    t.date("date").notNullable()

    t.string("additionalNotes")

    t.string("status").notNullable()

    t.string("reservedTranspInfo")
    t.string("booking")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "travelDeskOtherTransportation" (
      "transportationID",
      "requestID",
      depart,
      arrive,
      "transportationType",
      "date",
      "additionalNotes",
      "status",
      "reservedTranspInfo",
      booking
    )
    SELECT
      id AS "transportationID",
      travel_request_id AS "requestID",
      depart,
      arrive,
      transportation_type AS "transportationType",
      "date",
      additional_notes AS "additionalNotes",
      "status",
      reserved_transportation_info AS "reservedTranspInfo",
      booking
    FROM
      travel_desk_other_transportations
  `)

  await knex.schema.dropTable("travel_desk_other_transportations")
}
