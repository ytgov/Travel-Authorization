import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("travel_authorizations", (table) => {
    table.dropColumn("approved") // I believe this has been superceded by the "status" column?
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("travel_authorizations", (table) => {
    table.string("approved", 255)
  })
}
