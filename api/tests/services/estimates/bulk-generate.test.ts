import { BulkGenerate } from "@/services/estimates"

import { travelAuthorizationFactory, stopFactory, locationFactory } from "@/factories"
import { Expense, Stop } from "@/models"

describe("api/src/services/estimates/bulk-generate.ts", () => {
  describe("BulkGenerate", () => {
    describe(".perform", () => {
      test("creates some new estimates against the travel authorization", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create()

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
            departureTime: Stop.BEGINNING_OF_DAY,
            transport: Stop.TravelMethods.AIRCRAFT,
            accommodationType: null,
          },
          { associations: { travelAuthorization, location: vancouver } }
        )

        expect(await Expense.count()).toBe(0)
        await BulkGenerate.perform(travelAuthorization.id)
        expect(await Expense.count()).toBe(7)
      })
    })
  })
})
