import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.boolean("is_international_travel").notNullable().defaultTo(false)
  })

  await knex.raw(/*sql*/ `
    UPDATE
      travel_desk_travel_requests
    SET
      is_international_travel = TRUE
    WHERE
      passport_country IS NOT NULL
      OR passport_num IS NOT NULL
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.dropColumn("is_international_travel")
  })
}
