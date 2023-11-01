import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("division", 255).nullable()
    table.string("branch", 255).nullable()
    table.string("unit", 255).nullable()
    table.string("mailcode", 255).nullable()
    table.string("manager", 255).nullable()
    table.timestamp("last_employee_directory_sync_at").nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("division")
    table.dropColumn("branch")
    table.dropColumn("unit")
    table.dropColumn("mailcode")
    table.dropColumn("manager")
    table.dropColumn("last_employee_directory_sync_at")
  })
}
