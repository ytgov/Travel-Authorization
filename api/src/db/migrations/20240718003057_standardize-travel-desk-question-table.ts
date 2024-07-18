import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_desk_questions", (table) => {
    table.increments("id").primary()
    table.integer("travel_request_id").notNullable()
    table.string("request_type").notNullable()
    table.string("question").notNullable()
    table.string("response").nullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at")

    table
      .foreign("travel_request_id")
      .references("travel_desk_travel_requests.id")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO travel_desk_questions (
      id,
      travel_request_id,
      request_type,
      question,
      response,
      created_at
    )
    SELECT
      "questionID" AS id,
      "requestID" AS travel_request_id,
      "requestType" AS request_type,
      question,
      response,
      "creatingDate" AS created_at
    FROM
      "travelDeskQuestion"
  `)

  await knex.schema.dropTable("travelDeskQuestion")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("travelDeskQuestion", (table) => {
    table.increments("questionID").primary()
    table.integer("requestID").notNullable()
    table.datetime("creatingDate").notNullable()
    table.string("requestType").notNullable()
    table.string("question").notNullable()
    table.string("response").nullable()

    table.foreign("requestID").references("travel_desk_travel_requests.id").onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "travelDeskQuestion" (
      "questionID",
      "requestID",
      "requestType",
      question,
      response,
      "creatingDate"
    )
    SELECT
      id AS "questionID",
      travel_request_id AS "requestID",
      request_type AS "requestType",
      question,
      response,
      created_at AS "creatingDate"
    FROM
      travel_desk_questions
  `)

  await knex.schema.dropTable("travel_desk_questions")
}
