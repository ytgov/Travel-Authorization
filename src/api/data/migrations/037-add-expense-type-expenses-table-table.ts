import * as knex from "knex"

exports.up = async function (knex: knex.Knex) {
  await knex.schema.alterTable("expenses", function (table) {
    table.string("expenseType", 255).notNullable()
  })
}

exports.down = async function (knex: knex.Knex) {
  await knex.schema.alterTable("expenses", function (table) {
    table.dropColumn("expenseType")
  })
}
