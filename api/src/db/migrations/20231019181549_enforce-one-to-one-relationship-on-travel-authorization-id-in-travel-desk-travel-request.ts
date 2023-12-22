import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.unique(["travel_authorization_id"])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.dropUnique(["travel_authorization_id"])
  })
}
