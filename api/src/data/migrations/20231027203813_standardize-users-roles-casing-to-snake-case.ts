import { Knex } from "knex"

import { User } from "@/models"
import { isNil, snakeCase } from "lodash"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    WITH unnested_roles AS (
      SELECT
        id
        , CASE WHEN "role" = 'Admin' THEN 'admin'
               WHEN "role" = 'User' THEN 'user'
               WHEN "role" = 'PatAdmin' THEN 'pat_admin'
               WHEN "role" = 'DeptAdmin' THEN 'dept_admin'
               WHEN "role" = 'TdUser' THEN 'td_user'
               ELSE "role"
          END AS transformed_role
      FROM
        "users"
        , UNNEST(string_to_array(roles
            , ',')) AS "role"
      WHERE
        roles IS NOT NULL
    )
    , aggregated_updated_roles AS (
      SELECT
        id
        , STRING_AGG(transformed_role
          , ',') AS roles
      FROM
        unnested_roles
      GROUP BY
        id)
    UPDATE
      "users"
    SET
      roles = aggregated_updated_roles.roles
    FROM
      aggregated_updated_roles
    WHERE
      "users".id = aggregated_updated_roles.id
      AND "users".roles IS NOT NULL;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    WITH unnested_roles AS (
      SELECT
        id
        , CASE WHEN "role" = 'admin' THEN 'Admin'
               WHEN "role" = 'user' THEN 'User'
               WHEN "role" = 'pat_admin' THEN 'PatAdmin'
               WHEN "role" = 'dept_admin' THEN 'DeptAdmin'
               WHEN "role" = 'td_user' THEN 'TdUser'
               ELSE "role"
          END AS transformed_role
      FROM
        "users"
        , UNNEST(string_to_array(roles
            , ',')) AS "role"
      WHERE
        roles IS NOT NULL
    )
    , aggregated_updated_roles AS (
      SELECT
        id
        , STRING_AGG(transformed_role
          , ',') AS roles
      FROM
        unnested_roles
      GROUP BY
        id)
    UPDATE
      "users"
    SET
      roles = aggregated_updated_roles.roles
    FROM
      aggregated_updated_roles
    WHERE
      "users".id = aggregated_updated_roles.id
      AND "users".roles IS NOT NULL;
  `)
}
