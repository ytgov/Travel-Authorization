import { literal } from "sequelize"
import { type Literal } from "sequelize/lib/utils"
import minify from "pg-minify"

export function buildIsTravellingQuery(): Literal {
  const isTravellingQuery = minify(/* sql */ `
    (
      SELECT
        travel_authorization_id
      FROM (
        SELECT
          travel_authorizations.id AS travel_authorization_id
          , MIN(travel_segments.departure_on + COALESCE(travel_segments.departure_time, '00:00:00'::time)) AS departing_at
          , COALESCE(
              travel_authorizations.date_back_to_work::timestamp
              , MAX(travel_segments.departure_on + COALESCE(travel_segments.departure_time, '00:00:00'::time))
            ) AS returning_at
        FROM
          travel_authorizations
        INNER JOIN travel_segments ON travel_authorizations.id = travel_segments.travel_authorization_id
        GROUP BY
          travel_authorizations.id
      ) AS travel_periods
      WHERE
        :currentDate BETWEEN travel_periods.departing_at AND travel_periods.returning_at
    )
  `)
  return literal(isTravellingQuery)
}

export default buildIsTravellingQuery
