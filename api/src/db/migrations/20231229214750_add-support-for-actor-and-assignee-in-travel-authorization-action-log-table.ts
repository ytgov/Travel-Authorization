import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorization_action_logs", (table) => {
    table.integer("actor_id").unsigned().references("id").inTable("users").onDelete("RESTRICT")
    table.integer("assignee_id").unsigned().references("id").inTable("users").onDelete("RESTRICT")
  })

  await knex.raw(
    "UPDATE travel_authorization_action_logs SET actor_id = user_id, assignee_id = user_id"
  )

  await knex.schema.alterTable("travel_authorization_action_logs", (table) => {
    table.integer("actor_id").unsigned().notNullable().alter()
    table.integer("assignee_id").unsigned().notNullable().alter()
    table.dropColumn("user_id")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("travel_authorization_action_logs", (table) => {
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("RESTRICT")
  })

  await knex.raw("UPDATE travel_authorization_action_logs SET user_id = actor_id")

  await knex.schema.alterTable("travel_authorization_action_logs", (table) => {
    table.integer("user_id").unsigned().notNullable().alter()
    table.dropColumn("actor_id")
    table.dropColumn("assignee_id")
  })
}
