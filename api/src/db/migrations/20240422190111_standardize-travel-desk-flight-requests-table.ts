import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_desk_flight_requests", (table) => {
    table.increments("id").primary()
    table.integer("travel_request_id").notNullable()
    table.string("depart_location", 255).notNullable()
    table.string("arrive_location", 255).notNullable()
    table.date("date_preference").notNullable()
    table.string("time_preference", 255).notNullable()
    table.string("seat_preference", 255).notNullable()

    table.timestamps(true, true)
    table.timestamp("deleted_at").defaultTo(null)

    table
      .foreign("travel_request_id")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO travel_desk_flight_requests (
      id,
      travel_request_id,
      depart_location,
      arrive_location,
      date_preference,
      time_preference,
      seat_preference
    )
    SELECT
      "flightRequestID" as id,
      "requestID" as travel_request_id,
      "departLocation" as depart_location,
      "arriveLocation" as arrive_location,
      "date" as date_preference,
      "timePreference" as time_preference,
      "seatPreference" as seat_preference
    FROM "travelDeskFlightRequest"
  `)

  await knex.schema.alterTable("travelDeskFlightOption", (table) => {
    table.dropForeign(["flightRequestID"])

    table
      .foreign("flightRequestID")
      .references("id")
      .inTable("travel_desk_flight_requests")
      .onDelete("CASCADE")
  })

  await knex.schema.dropTable("travelDeskFlightRequest")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("travelDeskFlightRequest", (table) => {
    table.increments("flightRequestID").primary()
    table.integer("requestID").notNullable()
    table.string("departLocation", 255).notNullable()
    table.string("arriveLocation", 255).notNullable()
    table.date("date").notNullable()
    table.string("timePreference", 255).notNullable()
    table.string("seatPreference", 255).notNullable()

    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "travelDeskFlightRequest" (
      "flightRequestID",
      "requestID",
      "departLocation",
      "arriveLocation",
      "date",
      "timePreference",
      "seatPreference"
    )
    SELECT
      id as "flightRequestID",
      travel_request_id as "requestID",
      depart_location as "departLocation",
      arrive_location as "arriveLocation",
      date_preference as "date",
      time_preference as "timePreference",
      seat_preference as "seatPreference"
    FROM travel_desk_flight_requests
  `)

  await knex.schema.alterTable("travelDeskFlightOption", (table) => {
    table.dropForeign(["flightRequestID"])

    table
      .foreign("flightRequestID")
      .references("flightRequestID")
      .inTable("travelDeskFlightRequest")
      .onDelete("CASCADE")
  })

  await knex.schema.dropTable("travel_desk_flight_requests")
}
