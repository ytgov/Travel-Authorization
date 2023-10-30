import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE
      "users"
    SET
      "status" = CASE WHEN "status" = 'Active' THEN 'active'
                      WHEN "status" = 'Inactive' THEN 'inactive'
                      ELSE "status"
                 END
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE
      "users"
    SET
      "status" = CASE WHEN "status" = 'active' THEN 'Active'
                      WHEN "status" = 'inactive' THEN 'Inactive'
                      ELSE "status"
                 END
  `)
}
