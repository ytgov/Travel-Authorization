import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("general_ledger_codings", (table) => {
    table.string("code", 26).notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("general_ledger_codings", (table) => {
    table.string("code", 25).alter()
  })
}
