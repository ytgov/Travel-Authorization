import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_desk_hotels", (table) => {
    table.increments("id").notNullable().primary()
    table.integer("travel_request_id").unsigned().notNullable()

    table.string("city").notNullable()
    table.boolean("is_dedicated_conference_hotel_available").notNullable()
    table.string("conference_name").notNullable()
    table.string("conference_hotel_name").notNullable()

    table.date("check_in").notNullable()
    table.date("check_out").notNullable()

    table.string("additional_information")

    table.string("status").notNullable()

    // I can't find any reference to reservedHotelInfo or booking actually being used
    table.string("reserved_hotel_info")
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
    INSERT INTO travel_desk_hotels (
      id,
      travel_request_id,
      city,
      is_dedicated_conference_hotel_available,
      conference_name,
      conference_hotel_name,
      check_in,
      check_out,
      additional_information,
      "status",
      reserved_hotel_info,
      booking
    )
    SELECT
      "hotelID" as id,
      "requestID" as travel_request_id,
      city,
      "rsvConferenceHotel" as is_dedicated_conference_hotel_available,
      "conferenceName" as conference_name,
      "conferenceHotelName" as conference_hotel_name,
      "checkIn" as check_in,
      "checkOut" as check_out,
      "additionalInformation" as additional_information,
      "status",
      "reservedHotelInfo" as reserved_hotel_info,
      "booking"
    FROM "travelDeskHotel"
  `)

  await knex.schema.dropTable("travelDeskHotel")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("travelDeskHotel", (table) => {
    table.increments("hotelID").notNullable().primary()
    table.integer("requestID").unsigned().notNullable()
    table
      .foreign("requestID")
      .references("id")
      .inTable("travel_desk_travel_requests")
      .onDelete("CASCADE")

    table.string("city")

    table.boolean("rsvConferenceHotel")
    table.string("conferenceName")
    table.string("conferenceHotelName")

    table.date("checkIn")
    table.date("checkOut")

    table.string("additionalInformation")

    table.string("status").notNullable()

    table.string("reservedHotelInfo")
    table.string("booking")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "travelDeskHotel" (
      "hotelID",
      "requestID",
      city,
      "rsvConferenceHotel",
      "conferenceName",
      "conferenceHotelName",
      "checkIn",
      "checkOut",
      "additionalInformation",
      "status",
      "reservedHotelInfo",
      "booking"
    )
    SELECT
      id as "hotelID",
      travel_request_id as "requestID",
      city,
      is_dedicated_conference_hotel_available as "rsvConferenceHotel",
      conference_name as "conferenceName",
      conference_hotel_name as "conferenceHotelName",
      check_in as "checkIn",
      check_out as "checkOut",
      additional_information as "additionalInformation",
      "status",
      reserved_hotel_info as "reservedHotelInfo",
      booking
    FROM travel_desk_hotels
  `)

  await knex.schema.dropTable("travel_desk_hotels")
}
