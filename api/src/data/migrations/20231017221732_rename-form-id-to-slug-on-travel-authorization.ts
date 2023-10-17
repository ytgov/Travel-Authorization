import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("travel_authorizations", (table) => {
    table.renameColumn("form_id", "slug")
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("travel_authorizations", (table) => {
    table.renameColumn("slug", "form_id")
  })
}
