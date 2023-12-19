import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("expenses", (table) => {
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("expenses", (table) => {
    table.dropColumn("created_at")
    table.dropColumn("updated_at")
  })
}
