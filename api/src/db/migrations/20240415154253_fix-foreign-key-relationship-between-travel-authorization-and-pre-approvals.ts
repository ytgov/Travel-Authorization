import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("travel_authorizations", (table) => {
    table.integer("pre_approval_id").unsigned().nullable()
    table
      .foreign("pre_approval_id")
      .references("id")
      .inTable("travel_authorization_pre_approvals")
      .onDelete("SET NULL")
  })

  await knex.raw(/*sql*/ `
    UPDATE travel_authorizations
    SET pre_approval_id = (
      SELECT id
      FROM travel_authorization_pre_approvals
      WHERE travel_authorizations.preapp_id = id
    )
  `)

  await knex.schema.table("travel_authorizations", (table) => {
    table.dropColumn("preapp_id")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("travel_authorizations", (table) => {
    table.integer("preapp_id")
  })

  await knex.raw(/*sql*/ `
    UPDATE travel_authorizations
    SET preapp_id = (
      SELECT id
      FROM travel_authorization_pre_approvals
      WHERE travel_authorizations.pre_approval_id = id
    )
  `)

  await knex.schema.table("travel_authorizations", (table) => {
    table.dropForeign(["pre_approval_id"])
    table.dropColumn("pre_approval_id")
  })
}
