import { last, first, pick } from "lodash"

import { TravelAuthorization } from "@/models"

import BaseSerializer from "./base-serializer"

export class TravelAuthorizationsSerializer extends BaseSerializer {
  static asTable(travelAuthorizations: TravelAuthorization[]) {
    return travelAuthorizations.map((travelAuthorization) => {
      const firstStop = first(travelAuthorization.stops)
      const lastStop = last(travelAuthorization.stops)

      return {
        ...pick(travelAuthorization, ["id", "status"]),
        finalDestination: lastStop?.location,
        departingAt: firstStop?.departureAt,
        returningAt: lastStop?.departureAt,
      }
    })
  }
}

export default TravelAuthorizationsSerializer
