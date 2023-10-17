import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("expenses", (table) => {
    table.dropForeign(["form_id"])

    table.renameColumn("form_id", "travel_authorization_id")

    table
      .foreign("travel_authorization_id")
      .references("id")
      .inTable("travel_authorizations")
      .onDelete("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("expenses", (table) => {
    table.dropForeign(["travel_authorization_id"])

    table.renameColumn("travel_authorization_id", "form_id")

    table.foreign("form_id").references("id").inTable("forms").onDelete("CASCADE")
  })
}
