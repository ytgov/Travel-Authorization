import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_passenger_name_record_documents", async (table) => {
    table.dropPrimary()
    table.renameColumn("documentID", "id")
    table.primary(["id"])
  })

  await knex.raw(
    'ALTER SEQUENCE "travel_desk_passenger_name_record_documents_documentID_seq" RENAME TO "travel_desk_passenger_name_record_documents_id_seq"'
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_desk_passenger_name_record_documents", async (table) => {
    table.dropPrimary()
    table.renameColumn("id", "documentID")
    table.primary(["documentID"])
  })
  await knex.raw(
    'ALTER SEQUENCE "travel_desk_passenger_name_record_documents_id_seq" RENAME TO "travel_desk_passenger_name_record_documents_documentID_seq"'
  )
}
