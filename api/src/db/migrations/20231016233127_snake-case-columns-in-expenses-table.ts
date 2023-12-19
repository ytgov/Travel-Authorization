import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("expenses", (table) => {
    table.renameColumn("receiptImage", "receipt_image")
    table.renameColumn("fileSize", "file_size")
    table.renameColumn("fileName", "file_name")
    table.renameColumn("expenseType", "expense_type")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("expenses", (table) => {
    table.renameColumn("receipt_image", "receiptImage")
    table.renameColumn("file_size", "fileSize")
    table.renameColumn("file_name", "fileName")
    table.renameColumn("expense_type", "expenseType")
  })
}
