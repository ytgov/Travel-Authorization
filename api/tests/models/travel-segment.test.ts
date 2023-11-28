import { travelSegmentFactory } from "@/factories"

describe("api/src/models/travel-segment.ts", () => {
  describe("TravelSegment", () => {
    describe("#departureAt", () => {
      test("when the departureOn is null, departureAt is null", () => {
        const travelSegment = travelSegmentFactory.build({ departureOn: null })

        expect(travelSegment.departureAt).toBeNull()
      })

      test("when the departure time is null, time defaults to the beginning of the day", () => {
        const travelSegment = travelSegmentFactory.build({
          departureOn: new Date("2021-01-01"),
          departureTime: null,
          segmentNumber: 0
        })

        expect(travelSegment.departureAt).toEqual(new Date("2021-01-01T00:00:00"))
      })
    })
  })
})
