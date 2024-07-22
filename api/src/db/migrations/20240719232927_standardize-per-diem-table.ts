import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("per_diems", (table) => {
    table.increments("id").primary()
    table.string("claim_type").notNullable()
    table.string("travel_region").notNullable()
    table.float("amount").notNullable()
    table.string("currency").notNullable()

    table.timestamps(true, true)
    table.timestamp("deleted_at")

    table.unique(["claim_type", "travel_region", "currency"], {
      indexName: "per_diems_claim_type_travel_region_currency_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.raw(/*sql*/ `
    INSERT INTO per_diems (
      id,
      claim_type,
      travel_region,
      amount,
      currency
    )
    SELECT
      "id" AS id,
      claim as claim_type,
      "location" as travel_region,
      amount,
      currency
    FROM
      "perDiems"
    ON CONFLICT (claim_type, travel_region, currency) WHERE deleted_at IS NULL
    DO NOTHING
  `)

  await knex.schema.dropTable("perDiems")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("perDiems", (table) => {
    table.increments("id").primary()
    table.string("claim").notNullable()
    table.string("location").notNullable()
    table.float("amount").notNullable()
    table.string("currency").notNullable()
  })

  await knex.raw(/*sql*/ `
    INSERT INTO "perDiems" (
      id,
      claim,
      "location",
      amount,
      currency
    )
    SELECT
      id,
      claim_type as claim,
      "travel_region" as "location",
      amount,
      currency
    FROM
      per_diems
    WHERE
      deleted_at IS NULL
  `)

  await knex.schema.dropTable("per_diems")
}
