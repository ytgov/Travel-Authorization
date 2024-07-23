import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_allowances", (table) => {
    table.increments("id").primary()
    table.string("allowance_type").notNullable()
    table.float("amount").notNullable()
    table.string("currency").notNullable()

    table.timestamps(true, true)
    table.timestamp("deleted_at")

    table.unique(["allowance_type", "currency"], {
      indexName: "travel_allowances_allowance_type_currency_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("travel_allowances")
}
