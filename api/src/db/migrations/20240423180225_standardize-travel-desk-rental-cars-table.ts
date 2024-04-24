import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_desk_rental_cars", (table) => {
    table.increments("id").primary()
    table.integer("travel_request_id").unsigned().notNullable()

    table.string("pick_up_city").notNullable()
    table.string("pick_up_location").notNullable()
    table.string("pick_up_location_other")
    table.string("drop_off_city")
    table.string("drop_off_location")
    table.string("drop_off_location_other")
    table.boolean("same_drop_off_location")
    table.boolean("match_flight_times")

    table.string("vehicle_type_change_indicator")
    table.string("vehicle_type").notNullable()
    table.string("vehicle_change_rationale")

    table.datetime("pick_up_date").notNullable()
    table.datetime("drop_off_date").notNullable()
    table.string("additional_notes")

    table.string("status").notNullable()

    table.string("reserved_vehicle_info")
    table.string("booking")

    table.timestamps(true, true)
    table.timestamp("deleted_at").defaultTo(null)

    table
      .foreign("travel_request_id")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO travel_desk_rental_cars (
      id,
      travel_request_id,
      pick_up_city,
      pick_up_location,
      pick_up_location_other,
      drop_off_city,
      drop_off_location,
      drop_off_location_other,
      same_drop_off_location,
      match_flight_times,
      vehicle_type_change_indicator,
      vehicle_type,
      vehicle_change_rationale,
      pick_up_date,
      drop_off_date,
      additional_notes,
      "status",
      reserved_vehicle_info,
      booking
    )
    SELECT
      "rentalVehicleID" as id,
      "requestID" as travel_request_id,
      "pickUpCity" as pick_up_city,
      "pickUpLocation" as pick_up_location,
      "pickUpLocOther" as pick_up_location_other,
      "dropOffCity" as drop_off_city,
      "dropOffLocation" as drop_off_location,
      "dropOffLocOther" as drop_off_location_other,
      "sameDropOffLocation" as same_drop_off_location,
      "matchFlightTimes" as match_flight_times,
      "vehicleTypeChangeInd" as vehicle_type_change_indicator,
      "vehicleType" as vehicle_type,
      "vehicleChangeRationale" as vehicle_change_rationale,
      "pickUpDate" as pick_up_date,
      "dropOffDate" as drop_off_date,
      "additionalNotes" as additional_notes,
      "status",
      "reservedVehicleInfo" as reserved_vehicle_info,
      "booking"
    FROM "travelDeskRentalCar"
  `)

  await knex.schema.dropTable("travelDeskRentalCar")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("travelDeskRentalCar", (table) => {
    table.increments("rentalVehicleID").notNullable().primary()
    table.integer("requestID").unsigned().notNullable()

    table.string("pickUpCity").notNullable()
    table.string("pickUpLocation").notNullable()
    table.string("pickUpLocOther")
    table.string("dropOffCity")
    table.string("dropOffLocation")
    table.string("dropOffLocOther")
    table.boolean("sameDropOffLocation").notNullable().defaultTo(true)
    table.boolean("matchFlightTimes").notNullable().defaultTo(false)

    table.string("vehicleTypeChangeInd")
    table.string("vehicleType").notNullable()
    table.string("vehicleChangeRationale")

    table.datetime("pickUpDate").notNullable()
    table.datetime("dropOffDate").notNullable()
    table.string("additionalNotes")

    table.string("status").notNullable()

    table.string("reservedVehicleInfo")
    table.string("booking")

    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "travelDeskRentalCar" (
      "rentalVehicleID",
      "requestID",
      "pickUpCity",
      "pickUpLocation",
      "pickUpLocOther",
      "dropOffCity",
      "dropOffLocation",
      "dropOffLocOther",
      "sameDropOffLocation",
      "matchFlightTimes",
      "vehicleTypeChangeInd",
      "vehicleType",
      "vehicleChangeRationale",
      "pickUpDate",
      "dropOffDate",
      "additionalNotes",
      "status",
      "reservedVehicleInfo",
      "booking"
    )
    SELECT
      id as "rentalVehicleID",
      travel_request_id as "requestID",
      pick_up_city as "pickUpCity",
      pick_up_location as "pickUpLocation",
      pick_up_location_other as "pickUpLocOther",
      drop_off_city as "dropOffCity",
      drop_off_location as "dropOffLocation",
      drop_off_location_other as "dropOffLocOther",
      same_drop_off_location as "sameDropOffLocation",
      match_flight_times as "matchFlightTimes",
      vehicle_type_change_indicator as "vehicleTypeChangeInd",
      vehicle_type as "vehicleType",
      vehicle_change_rationale as "vehicleChangeRationale",
      pick_up_date as "pickUpDate",
      drop_off_date as "dropOffDate",
      additional_notes as "additionalNotes",
      "status",
      reserved_vehicle_info as "reservedVehicleInfo",
      booking
    FROM travel_desk_rental_cars
  `)

  await knex.schema.dropTable("travel_desk_rental_cars")
}
