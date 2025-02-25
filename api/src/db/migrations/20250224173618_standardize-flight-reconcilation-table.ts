import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("flight_reconciliations", (table) => {
    table.increments("id").primary()
    table.integer("reconciler_id").notNullable()
    table.integer("external_trav_com_identifier").notNullable()
    table.boolean("reconciled").defaultTo(false).notNullable()
    table.integer("reconcile_period")

    table.timestamps(true, true)
    table.timestamp("deleted_at")

    table.foreign("reconciler_id").references("users.id")

    // NOTE: external_trav_com_identifier does not have a foreign key reference as it references an external database
    table.unique(["external_trav_com_identifier"], {
      indexName: "flight_reconciliations_external_trav_com_identifier_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.raw(/* sql */ `
    UPDATE "flight_reconciliations"
    SET
      id = "reconcileID",
      reconciler_id = -1, -- we have just started tracking the reconciler
      external_trav_com_identifier = "invoiceDetailID",
      reconciled = "flightReconciliation"."reconciled",
      reconcile_period = "reconcilePeriod"
    FROM
      "flightReconciliation"
  `)

  await knex.schema.dropTable("flightReconciliation")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("flightReconciliation", (table) => {
    table.increments("reconcileID").notNullable().primary()
    table.integer("invoiceID").unsigned().notNullable()
    table.integer("invoiceDetailID").unsigned().notNullable().unique()
    table.boolean("reconciled").defaultTo(false)
    table.integer("reconcilePeriod")
  })

  await knex.raw(/* sql */ `
    UPDATE "flightReconciliation"
    SET
      "reconcileID" = id,
      "invoiceID" = -1, -- We are no longer tracking this information as it can be extraced from the invoice detail id
      "invoiceDetailID" = external_trav_com_identifier,
      "reconciled" = "flightReconciliation"."reconciled",
      "reconcilePeriod" = "reconcilePeriod"
    FROM
      "flight_reconciliations"
  `)

  await knex.schema.dropTable("flight_reconciliations")
}
