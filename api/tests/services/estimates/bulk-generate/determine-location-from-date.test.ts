import { TravelSegment } from "@/models"
import { locationFactory, travelAuthorizationFactory, travelSegmentFactory } from "@/factories"

import { determineLocationFromDate } from "@/services/estimates/bulk-generate/determine-location-from-date"

describe("api/src/services/estimates/bulk-generate/determine-location-from-date.ts", () => {
  describe(".determineLocationFromDate", () => {
    test("example case of 3 day trip", async () => {
      const travelAuthorization = await travelAuthorizationFactory
        .transient({ roundTrip: true })
        .create()
      const whitehorse = await locationFactory.create({ city: "Whitehorse", province: "YT" })
      const vancouver = await locationFactory.create({ city: "Vancouver", province: "BC" })
      const travelSegment1 = await travelSegmentFactory
        .associations({
          travelAuthorization,
          departureLocation: whitehorse,
          arrivalLocation: vancouver,
        })
        .create({
          segmentNumber: 1,
          departureOn: new Date("2022-06-05"),
          departureTime: "00:00:00",
          modeOfTransport: TravelSegment.TravelMethods.AIRCRAFT,
          accommodationType: TravelSegment.AccommodationTypes.HOTEL,
        })
      const travelSegment2 = await travelSegmentFactory
        .associations({
          travelAuthorization,
          departureLocation: vancouver,
          arrivalLocation: whitehorse,
        })
        .create({
          segmentNumber: 2,
          departureOn: new Date("2022-06-07"),
          departureTime: "15:00:00",
          modeOfTransport: TravelSegment.TravelMethods.AIRCRAFT,
          accommodationType: null,
        })
      const travelSegments = [travelSegment1, travelSegment2]

      expect(determineLocationFromDate(travelSegments, new Date("2022-06-05"))).toEqual(vancouver)
      expect(determineLocationFromDate(travelSegments, new Date("2022-06-06"))).toEqual(vancouver)
      expect(determineLocationFromDate(travelSegments, new Date("2022-06-07 15:00:00"))).toEqual(
        vancouver
      )
    })
  })
})
