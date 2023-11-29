import { stopFactory, travelAuthorizationFactory, travelSegmentFactory } from "@/factories"
import { TravelSegment } from "@/models"
import { fa, faker } from "@faker-js/faker"

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
          segmentNumber: 0,
        })

        expect(travelSegment.departureAt).toEqual(new Date("2021-01-01T00:00:00"))
      })
    })

    describe(".buildFromStops", () => {
      test("when the params are valid, builds the correct travel segment", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create()
        const departureStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
          transport: TravelSegment.TravelMethods.AIRCRAFT,
          accommodationType: TravelSegment.AccommodationTypes.HOTEL,
        })
        const arrivalStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
        })
        const segmentNumber = faker.number.int({ min: 0, max: 10 })

        const travelSegment = TravelSegment.buildFromStops({
          travelAuthorizationId: travelAuthorization.id,
          segmentNumber,
          departureStop,
          arrivalStop,
        })

        expect(travelSegment).toEqual(
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            departureLocationId: departureStop.locationId,
            arrivalLocationId: arrivalStop.locationId,
            segmentNumber,
            departureOn: departureStop.departureDate,
            departureTime: departureStop.departureTime,
            modeOfTransport: departureStop.transport,
            accommodationType: departureStop.accommodationType,
          })
        )
      })

      test("when the departure stop is missing a transport, throws an error", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create()
        const departureStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
          transport: null,
        })
        const arrivalStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
        })
        const segmentNumber = faker.number.int({ min: 0, max: 10 })

        expect(() =>
          TravelSegment.buildFromStops({
            travelAuthorizationId: travelAuthorization.id,
            segmentNumber,
            departureStop,
            arrivalStop,
          })
        ).toThrow(`Missing transport on Stop#${departureStop.id}`)
      })

      test("when the departure stop has a transport that is not non-standard, sets modeOfTransportOther", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create()
        const departureStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
          transport: "Running",
        })
        const arrivalStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
        })
        const segmentNumber = faker.number.int({ min: 0, max: 10 })

        const travelSegment = TravelSegment.buildFromStops({
          travelAuthorizationId: travelAuthorization.id,
          segmentNumber,
          departureStop,
          arrivalStop,
        })

        expect(travelSegment).toEqual(
          expect.objectContaining({
            modeOfTransport: TravelSegment.TravelMethods.OTHER,
            modeOfTransportOther: "Running",
          })
        )
      })

      test("when the departure stop has an accommodation type that is not non-standard, sets accommodationTypeOther", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create()
        const departureStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
          accommodationType: "Camping",
        })
        const arrivalStop = await stopFactory.create({
          travelAuthorizationId: travelAuthorization.id,
        })
        const segmentNumber = faker.number.int({ min: 0, max: 10 })

        const travelSegment = TravelSegment.buildFromStops({
          travelAuthorizationId: travelAuthorization.id,
          segmentNumber,
          departureStop,
          arrivalStop,
        })

        expect(travelSegment).toEqual(
          expect.objectContaining({
            accommodationType: TravelSegment.AccommodationTypes.OTHER,
            accommodationTypeOther: "Camping",
          })
        )
      })
    })
  })
})
