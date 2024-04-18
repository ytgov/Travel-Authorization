import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/*sql*/ `
    UPDATE travel_authorization_pre_approvals
    SET status = CASE
      WHEN status = 'Draft' THEN 'draft'
      WHEN status = 'Submitted' THEN 'submitted'
      WHEN status = 'Approved' THEN 'approved'
      WHEN status = 'Declined' THEN 'declined'
      ELSE status
    END;
  `)

  await knex.raw(/*sql*/ `
    UPDATE "preapprovedSubmissions"
    SET status = CASE
      WHEN status = 'Draft' THEN 'draft'
      WHEN status = 'Submitted' THEN 'submitted'
      WHEN status = 'Finished' THEN 'finished'
      ELSE status
    END;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/*sql*/ `
    UPDATE travel_authorization_pre_approval_submissions
    SET status = CASE
      WHEN status = 'draft' THEN 'Draft'
      WHEN status = 'submitted' THEN 'Submitted'
      WHEN status = 'approved' THEN 'Approved'
      WHEN status = 'declined' THEN 'Declined'
      ELSE status
    END;
  `)

  await knex.raw(/*sql*/ `
    UPDATE "preapprovedSubmissions"
    SET status = CASE
      WHEN status = 'draft' THEN 'Draft'
      WHEN status = 'submitted' THEN 'Submitted'
      WHEN status = 'finished' THEN 'Finished'
      ELSE status
    END;
  `)
}
