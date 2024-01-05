import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE travel_authorizations
    SET status = 'expense_claim_submitted'
    WHERE status = 'expense_claim';
  `)
  await knex.raw(`
    UPDATE travel_authorization_action_logs
    SET action = 'expense_claim_submitted'
    WHERE action = 'expense_claim';
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE travel_authorizations
    SET status = 'expense_claim'
    WHERE status = 'expense_claim_submitted';
  `)
  await knex.raw(`
    UPDATE travel_authorization_action_logs
    SET action = 'expense_claim'
    WHERE action = 'expense_claim_submitted';
  `)
}
