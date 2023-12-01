import { isNil } from "lodash"

import { TravelSegment, Location } from "@/models"

export function determineLocationFromDate(travelSegments: TravelSegment[], date: Date): Location {
  const travelSegment = travelSegments.find((travelSegment) => {
    if (isNil(travelSegment.departureAt)) return false

    return travelSegment.departureAt >= date
  })

  if (isNil(travelSegment)) {
    throw new Error(`Could not determine travel segment for date=${date}`)
  }

  let location
  const firstTravelSegment = travelSegments[0]
  const lastTravelSegment = travelSegments[travelSegments.length - 1]
  if (travelSegment === firstTravelSegment) {
    location = travelSegment.arrivalLocation
  } else if (travelSegment === lastTravelSegment) {
    location = travelSegment.departureLocation
  } else {
    location = travelSegment.departureLocation
  }

  if (isNil(location)) {
    throw new Error(`Missing arrival location on TravelSegment#${travelSegment.id}`)
  }

  return location
}
