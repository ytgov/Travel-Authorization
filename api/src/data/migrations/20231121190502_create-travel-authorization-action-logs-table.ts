import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_authorization_action_logs", (table) => {
    table.increments("id").primary()
    table
      .integer("travel_authorization_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("travel_authorizations")
      .onDelete("CASCADE")
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
    table.string("action").notNullable()
    table.string("note").nullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("travel_authorization_action_logs")
}
