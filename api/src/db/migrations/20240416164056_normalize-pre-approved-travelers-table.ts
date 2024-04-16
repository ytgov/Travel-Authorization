import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  /** Table contains a mix of users and user groups  */
  await knex.schema.createTable("travel_authorization_pre_approval_profiles", (table) => {
    table.increments("id").notNullable().primary()
    table.integer("pre_approval_id").notNullable()
    table.string("profile_name").notNullable()
    table.string("department").notNullable()
    table.string("branch").nullable()

    table.timestamps(true, true)
    table.timestamp("deleted_at").defaultTo(null)

    table
      .foreign("pre_approval_id")
      .references("id")
      .inTable("travel_authorization_pre_approvals")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "travel_authorization_pre_approval_profiles"(
      "pre_approval_id"
      , "profile_name"
      , "department"
      , "branch")
    SELECT
      "pre_approval_id"
      , "fullName" AS "profile_name"
      , "department"
      , "branch"
    FROM
      "preapprovedTravelers"
  `)

  await knex.schema.dropTable("preapprovedTravelers")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("preapprovedTravelers", (table) => {
    table.increments("id").notNullable().primary()
    table.integer("pre_approval_id").notNullable()
    table.string("fullName").notNullable()
    table.string("department").notNullable()
    table.string("branch").nullable()

    table
      .foreign("pre_approval_id")
      .references("id")
      .inTable("travel_authorization_pre_approvals")
      .onDelete("CASCADE")
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "preapprovedTravelers"(
      "pre_approval_id"
      , "fullName"
      , "department"
      , "branch")
    SELECT
      "pre_approval_id"
      , "profile_name" AS "fullName"
      , "department"
      , "branch"
    FROM
      "travel_authorization_pre_approval_profiles"
  `)

  await knex.schema.dropTable("travel_authorization_pre_approval_profiles")
}
