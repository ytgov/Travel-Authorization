import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("general_ledger_codings", (table) => {
    table.increments("id").primary()
    table
      .integer("travel_authorization_id")
      .notNullable()
      .references("id")
      .inTable("travel_authorizations")
      .onDelete("CASCADE")
    table.string("code", 25).notNullable()
    table.decimal("amount", 14, 2).notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("general_ledger_codings")
}
