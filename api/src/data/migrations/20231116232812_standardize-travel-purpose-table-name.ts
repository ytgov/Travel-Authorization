import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorizations", (table) => {
    // NOTE: legacy name do to bad previous migration
    table.dropForeign(["purpose_id"], "forms_purposeid_foreign")
  })
  await knex.schema.alterTable("travelPurpose", async (table) => {
    table.dropPrimary()
  })
  await knex.schema.renameTable("travelPurpose", "travel_purposes")

  await knex.schema.alterTable("travel_purposes", async (table) => {
    table.primary(["id"])
  })
  await knex.raw(`ALTER SEQUENCE "travelPurpose_id_seq" RENAME TO "travel_purposes_id_seq"`)
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table.foreign("purpose_id").references("id").inTable("travel_purposes").onDelete("SET NULL")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table.dropForeign(["purpose_id"])
  })
  await knex.schema.alterTable("travel_purposes", async (table) => {
    table.dropPrimary()
  })
  await knex.schema.renameTable("travel_purposes", "travelPurpose")

  await knex.schema.alterTable("travelPurpose", async (table) => {
    table.primary(["id"])
  })
  await knex.raw(`ALTER SEQUENCE "travel_purposes_id_seq" RENAME TO "travelPurpose_id_seq"`)

  // NOTE: legacy name do to bad previous migration
  await knex.schema.alterTable("travel_authorizations", (table) => {
    table
      .foreign("purpose_id", "forms_purposeid_foreign")
      .references("id")
      .inTable("travelPurpose")
      .onDelete("SET NULL")
  })
}
