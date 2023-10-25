import { isEmpty, isNil, minBy, pick } from "lodash"

import { TravelAuthorization } from "@/models"

import BaseSerializer from "./base-serializer"

export class TravelAuthorizationsSerializer extends BaseSerializer {
  static asTable(travelAuthorizations: TravelAuthorization[]) {
    return travelAuthorizations.map((travelAuthorization) => {
      return {
        ...pick(travelAuthorization, ["id", "department", "branch", "dateBackToWork", "status"]),
        purpose: travelAuthorization.purpose?.purpose,
        departingAt: this.departingAt(travelAuthorization),
      }
    })
  }

  private static departingAt(travelAuthorization: TravelAuthorization) {
    const stops = travelAuthorization.stops || []
    if (isEmpty(stops)) return "Unknown"

    const firstStop = minBy(stops, ({ departureDate, departureTime }) => {
      const departingAtString = `${departureDate}T${departureTime}`
      return new Date(departingAtString)
    })
    if (isNil(firstStop)) return "Unknown"

    const { departureDate, departureTime } = firstStop
    const departingAtString = `${departureDate}T${departureTime}`
    return new Date(departingAtString)
  }
}

export default TravelAuthorizationsSerializer
