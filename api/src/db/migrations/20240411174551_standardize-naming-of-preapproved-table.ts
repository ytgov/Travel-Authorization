import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_authorization_pre_approvals", (t) => {
    t.increments("id").notNullable().primary() // preTID
    t.integer("submission_id").unsigned() // preTSubID

    t.integer("estimated_cost").notNullable()
    t.string("location").notNullable()
    t.string("department")
    t.string("branch")
    t.string("purpose")
    t.string("reason")
    t.date("start_date")
    t.date("end_date")
    t.boolean("is_open_for_any_date").notNullable().defaultTo(false)
    t.string("month")
    t.boolean("is_open_for_any_traveler").notNullable().defaultTo(false)
    t.integer("number_travelers")
    t.string("traveler_notes")
    t.string("status")

    t.timestamps(true, true)
    t.timestamp("deleted_at").defaultTo(null)

    t.foreign("submission_id")
      .references("preTSubID")
      .inTable("preapprovedSubmissions")
      .onDelete("SET NULL")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO travel_authorization_pre_approvals (
      id,
      submission_id,
      department,
      branch,
      purpose,
      reason,
      "start_date",
      end_date,
      is_open_for_any_date,
      "month",
      estimated_cost,
      is_open_for_any_traveler,
      number_travelers,
      traveler_notes,
      "location"
    )
    SELECT
      "preTID" as id,
      "preTSubID" as submission_id,
      department,
      branch,
      purpose,
      reason,
      "startDate" as "start_date",
      "endDate" as end_date,
      CAST("dateUnkInd" as BOOLEAN) as "is_open_for_any_date",
      "month",
      "estimatedCost" as estimated_cost,
      CAST("travelerUnkInd" as BOOLEAN) as "is_open_for_any_traveler",
      "numberTravelers" as number_travelers,
      "travelerNotes" as traveler_notes,
      "location"
    FROM
      preapproved
  `)

  await knex.schema.table("preapprovedTravelers", (t) => {
    t.integer("pre_approval_id").unsigned().nullable()
    t.foreign("pre_approval_id")
      .references("id")
      .inTable("travel_authorization_pre_approvals")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    UPDATE "preapprovedTravelers"
    SET pre_approval_id = "preTID"
  `)

  await knex.schema.alterTable("preapprovedTravelers", (t) => {
    t.integer("pre_approval_id").unsigned().notNullable().alter()
  })

  await knex.schema.table("preapprovedTravelers", (t) => {
    t.dropForeign(["preTID"])
    t.dropColumn("preTID")
  })

  await knex.schema.dropTable("preapproved")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("preapproved", (table) => {
    table.increments("preTID").primary()
    table.integer("preTSubID").nullable()
    table.string("department", 255)
    table.string("branch", 255)
    table.string("purpose", 255)
    table.string("reason", 255)
    table.date("startDate")
    table.date("endDate")
    table.integer("dateUnkInd").notNullable()
    table.string("month", 255)
    table.integer("estimatedCost").notNullable()
    table.integer("travelerUnkInd").notNullable()
    table.integer("numberTravelers")
    table.string("travelerNotes", 255)
    table.string("location", 255).notNullable()
    table.string("status", 255)

    table
      .foreign("preTSubID")
      .references("preTSubID")
      .inTable("public.preapprovedSubmissions")
      .onDelete("SET NULL")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO preapproved (
      "preTID",
      "preTSubID",
      department,
      branch,
      purpose,
      reason,
      "startDate",
      "endDate",
      "dateUnkInd",
      "month",
      "estimatedCost",
      "travelerUnkInd",
      "numberTravelers",
      "travelerNotes",
      "location"
    )
    SELECT
      id as "preTID",
      submission_id as "preTSubID",
      department,
      branch,
      purpose,
      reason,
      "start_date" as "startDate",
      end_date,
      CAST(is_open_for_any_date as INT) as "dateUnkInd",
      "month",
      estimated_cost as "estimatedCost",
      CAST(is_open_for_any_traveler as INT) AS "travelerUnkInd",
      number_travelers as "numberTravelers",
      traveler_notes as "travelerNotes",
      "location"
    FROM
      travel_authorization_pre_approvals
  `)

  await knex.schema.table("preapprovedTravelers", (t) => {
    t.integer("preTID").unsigned().nullable()
    t.foreign("preTID").references("preTID").inTable("preapproved").onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    UPDATE "preapprovedTravelers"
    SET "preTID" = pre_approval_id
  `)

  await knex.schema.alterTable("preapprovedTravelers", (t) => {
    t.integer("preTID").unsigned().notNullable().alter()
  })

  await knex.schema.table("preapprovedTravelers", (t) => {
    t.dropForeign(["pre_approval_id"])
    t.dropColumn("pre_approval_id")
  })

  await knex.schema.dropTable("travel_authorization_pre_approvals")
}
