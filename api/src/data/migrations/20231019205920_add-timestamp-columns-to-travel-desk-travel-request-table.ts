import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("travel_desk_travel_requests", (table) => {
    table.timestamps(true, true)
  })

  await knex.raw(`
    UPDATE travel_desk_travel_requests
      SET created_at = submit_date
  `)

  await knex.schema.table("travel_desk_travel_requests", (table) => {
    table.dropColumn("submit_date")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.timestamp("submit_date").nullable()
  })

  await knex.raw(`
    UPDATE travel_desk_travel_requests
      SET submit_date = created_at
  `)

  await knex.schema.table("travel_desk_travel_requests", (table) => {
    table.dropColumn("created_at")
    table.dropColumn("updated_at")
  })
}
