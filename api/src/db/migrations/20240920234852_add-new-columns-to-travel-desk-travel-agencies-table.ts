import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_agencies", (table) => {
    table.string("contact_name")
    table.string("contact_email")
    table.string("contact_phone_number", 20)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_travel_agencies", (table) => {
    table.dropColumn("contact_name")
    table.dropColumn("contact_email")
    table.dropColumn("contact_phone_number")
  })
}
