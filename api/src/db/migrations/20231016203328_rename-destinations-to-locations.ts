import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("destinations", "locations")
  await knex.schema.alterTable("locations", (table) => {
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("locations", (table) => {
    table.dropColumn("created_at")
    table.dropColumn("updated_at")
  })
  await knex.schema.renameTable("locations", "destinations")
}
