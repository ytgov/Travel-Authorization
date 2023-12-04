import { BulkGenerateService } from "@/services/estimates"

import {
  locationFactory,
  perDiemFactory,
  stopFactory,
  travelAuthorizationFactory,
  travelSegmentFactory,
} from "@/factories"
import { PerDiem, Stop, TravelSegment } from "@/models"

describe("api/src/services/estimates/bulk-generate-service.ts", () => {
  describe("BulkGenerateService", () => {
    beforeEach(async () => {
      await perDiemFactory.create({
        claim: PerDiem.ClaimTypes.INCIDENTALS,
        location: PerDiem.LocationTypes.CANADA,
        amount: 17.30,
        currency: PerDiem.CurrencyTypes.CAD,
      })
      await perDiemFactory.create({
        claim: PerDiem.ClaimTypes.BREAKFAST,
        location: PerDiem.LocationTypes.CANADA,
        amount: 23.60,
        currency: PerDiem.CurrencyTypes.CAD,
      })
      await perDiemFactory.create({
        claim: PerDiem.ClaimTypes.LUNCH,
        location: PerDiem.LocationTypes.CANADA,
        amount: 23.90,
        currency: PerDiem.CurrencyTypes.CAD,
      })
      await perDiemFactory.create({
        claim: PerDiem.ClaimTypes.DINNER,
        location: PerDiem.LocationTypes.CANADA,
        amount: 58.60,
        currency: PerDiem.CurrencyTypes.CAD,
      })
    })

    describe(".perform", () => {
      test("creates some new estimates against the travel authorization", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create(
          {},
          {
            transient: { roundTrip: true },
          }
        )
        const whitehorse = await locationFactory.create({ city: "Whitehorse", province: "YT" })
        const vancouver = await locationFactory.create({ city: "Vancouver", province: "BC" })
        const travelSegment1 = await travelSegmentFactory.create(
          {
            departureOn: new Date("2022-06-05"),
            departureTime: Stop.BEGINNING_OF_DAY,
            modeOfTransport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: Stop.AccommodationTypes.HOTEL,
          },
          {
            associations: {
              travelAuthorization,
              departureLocation: whitehorse,
              arrivalLocation: vancouver,
            },
          }
        )
        const travelSegment2 = await travelSegmentFactory.create(
          {
            departureOn: new Date("2022-06-07"),
            departureTime: "12:00:00",
            modeOfTransport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: null,
          },
          {
            associations: {
              travelAuthorization,
              departureLocation: vancouver,
              arrivalLocation: whitehorse,
            },
          }
        )

        const expenses = await BulkGenerateService.perform(travelAuthorization.id, [
          travelSegment1,
          travelSegment2,
        ])

        expect(expenses).toEqual([
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Aircraft from Whitehorse to Vancouver",
            date: "2022-06-05",
            cost: 350.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Transportation",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Hotel in Vancouver",
            date: "2022-06-05",
            cost: 250.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Accomodations",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Hotel in Vancouver",
            date: "2022-06-06",
            cost: 250.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Accomodations",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Maximum Daily",
            date: "2022-06-05",
            cost: 123.4,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Maximum Daily",
            date: "2022-06-06",
            cost: 123.4,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Maximum Daily", // in future will be "Breakfast/Lunch" see https://github.com/icefoganalytics/travel-authorization/issues/121
            date: "2022-06-07",
            cost: 123.4, //  in future will be 46.7 see https://github.com/icefoganalytics/travel-authorization/issues/121
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Aircraft from Vancouver to Whitehorse",
            date: "2022-06-07",
            cost: 350.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Transportation",
          }),
        ])
      })

      test("when times are not specified, defaults to full day times", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create(
          {},
          {
            transient: { roundTrip: true },
          }
        )
        const whitehorse = await locationFactory.create({ city: "Whitehorse", province: "YT" })
        const vancouver = await locationFactory.create({ city: "Vancouver", province: "BC" })
        const travelSegment1 = await travelSegmentFactory.create(
          {
            departureOn: new Date("2022-06-05"),
            departureTime: null,
            modeOfTransport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: Stop.AccommodationTypes.HOTEL,
          },
          {
            associations: {
              travelAuthorization,
              departureLocation: whitehorse,
              arrivalLocation: vancouver,
            },
          }
        )
        const travelSegment2 = await travelSegmentFactory.create(
          {
            departureOn: new Date("2022-06-07"),
            departureTime: null,
            modeOfTransport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: null,
          },
          {
            associations: {
              travelAuthorization,
              departureLocation: vancouver,
              arrivalLocation: whitehorse,
            },
          }
        )

        const expenses = await BulkGenerateService.perform(travelAuthorization.id, [
          travelSegment1,
          travelSegment2,
        ])

        expect(expenses).toEqual([
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Aircraft from Whitehorse to Vancouver",
            date: "2022-06-05",
            cost: 350.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Transportation",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Hotel in Vancouver",
            date: "2022-06-05",
            cost: 250.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Accomodations",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Hotel in Vancouver",
            date: "2022-06-06",
            cost: 250.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Accomodations",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Maximum Daily",
            date: "2022-06-05",
            cost: 123.4,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Maximum Daily",
            date: "2022-06-06",
            cost: 123.4,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Maximum Daily", // in future will be "Breakfast/Lunch" see https://github.com/icefoganalytics/travel-authorization/issues/121
            date: "2022-06-07",
            cost: 123.4, //  in future will be 46.7 see https://github.com/icefoganalytics/travel-authorization/issues/121
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Aircraft from Vancouver to Whitehorse",
            date: "2022-06-07",
            cost: 350.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Transportation",
          }),
        ])
      })
    })
  })
})
