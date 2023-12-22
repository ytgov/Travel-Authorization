import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("expenses", (table) => {
    table.renameColumn("taid", "form_id")
    table.foreign("form_id").references("id").inTable("forms").onDelete("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("expenses", (table) => {
    table.dropForeign("form_id")
    table.renameColumn("form_id", "taid")
  })
}
