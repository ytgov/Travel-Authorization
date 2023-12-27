import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE expenses
    SET expense_type = 'Accommodations'
    WHERE expense_type = 'Accomodations'
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE expenses
    SET expense_type = 'Accomodations'
    WHERE expense_type = 'Accommodations'
  `)
}
