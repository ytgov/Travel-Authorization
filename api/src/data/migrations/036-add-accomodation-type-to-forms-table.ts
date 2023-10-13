import * as knex from "knex"

exports.up = async function (knex: knex.Knex) {
  await knex.schema.alterTable("forms", function (table) {
    table.string("accommodationType")
  })
}

exports.down = async function (knex: knex.Knex) {
  await knex.schema.alterTable("forms", function (table) {
    table.dropColumn("accommodationType")
  })
}
