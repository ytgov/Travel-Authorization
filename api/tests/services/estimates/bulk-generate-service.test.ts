import { BulkGenerateService } from "@/services/estimates"

import {
  locationFactory,
  perDiemFactory,
  stopFactory,
  travelAuthorizationFactory,
} from "@/factories"
import { Expense, PerDiem, Stop } from "@/models"

describe("api/src/services/estimates/bulk-generate-service.ts", () => {
  describe("BulkGenerateService", () => {
    describe(".perform", () => {
      test("creates some new estimates against the travel authorization", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create(
          {},
          {
            transient: { roundTrip: true },
          }
        )

        const whitehorse = await locationFactory.create({ city: "Whitehorse", province: "YT" })
        await stopFactory.create(
          {
            departureDate: new Date("2022-06-05"),
            departureTime: Stop.BEGINNING_OF_DAY,
            transport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: Stop.AccommodationTypes.HOTEL,
          },
          { associations: { travelAuthorization, location: whitehorse } }
        )

        const vancouver = await locationFactory.create({ city: "Vancouver", province: "BC" })
        await stopFactory.create(
          {
            travelAuthorizationId: travelAuthorization.id,
            departureDate: new Date("2022-06-07"),
            departureTime: "12:00:00",
            transport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: null,
          },
          { associations: { travelAuthorization, location: vancouver } }
        )
        await perDiemFactory.create({
          claim: PerDiem.ClaimTypes.MAXIMUM_DAILY,
          location: PerDiem.LocationTypes.CANADA,
          amount: 123.4,
          currency: PerDiem.CurrencyTypes.CAD,
        })

        expect(await Expense.count()).toBe(0)
        const expenses = await BulkGenerateService.perform(travelAuthorization.id)
        // TODO: fix bulk generation so it builds the correct number of estimates
        expect(await Expense.count()).toBe(7)

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
            description: "Aircraft from Vancouver to Whitehorse",
            date: "2022-06-07",
            cost: 350.0,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Transportation",
          }),
          expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            description: "Breakfast/Lunch",
            date: "2022-06-07",
            cost: 46.7,
            currency: "CAD",
            type: "Estimate",
            expenseType: "Meals & Incidentals",
          }),
        ])
      })
    })
  })
})
