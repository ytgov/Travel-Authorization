import { isNil } from "lodash"

import { TravelSegment, Location, TravelAuthorization } from "@/models"
import { type TripTypes } from "@/models/travel-authorization"

export function determineFinalDestination(travelSegments: TravelSegment[]): Location {
  const firstTravelSegment = travelSegments[0]
  const lastTravelSegment = travelSegments[travelSegments.length - 1]
  let tripType: TripTypes
  if (travelSegments.length === 1) {
    tripType = TravelAuthorization.TripTypes.ONE_WAY
  } else if (travelSegments.length === 2) {
    if (firstTravelSegment.departureLocationId === lastTravelSegment.arrivalLocationId) {
      tripType = TravelAuthorization.TripTypes.ROUND_TRIP
    } else {
      tripType = TravelAuthorization.TripTypes.MULTI_DESTINATION
    }
  } else {
    throw new Error(`Unknown trip type for travel segments of length ${travelSegments.length}`)
  }

  let finalDestination
  if (tripType === TravelAuthorization.TripTypes.ROUND_TRIP) {
    finalDestination = lastTravelSegment.departureLocation
  } else if (tripType === TravelAuthorization.TripTypes.ONE_WAY) {
    finalDestination = lastTravelSegment.arrivalLocation
  } else if (tripType === TravelAuthorization.TripTypes.MULTI_DESTINATION) {
    finalDestination = lastTravelSegment.arrivalLocation
  }

  if (isNil(lastTravelSegment)) {
    throw new Error("Could not determine final travel segment.")
  }

  if (isNil(finalDestination)) {
    throw new Error(`Missing arrival location on TravelSegment#${lastTravelSegment.id}`)
  }

  return finalDestination
}

export default determineFinalDestination
