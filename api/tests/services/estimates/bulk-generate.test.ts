import { BulkGenerate } from "@/services/estimates"

import { travelAuthorizationFactory } from "@/factories"
import { Expense } from "@/models"

describe("api/src/services/estimates/bulk-generate.ts", () => {
  describe("BulkGenerate", () => {
    describe(".perform", () => {
      test("creates some new estimates against the travel authorization", async () => {
        const travelAuthorization = await travelAuthorizationFactory.create()

        expect(await Expense.count()).toBe(0)
        const expenses = await BulkGenerate.perform(travelAuthorization.id)

        expect(expenses.length).toBe(99999) // TODO: replace with real number.
        expect(await Expense.count()).toBe(99999) // TODO: replace with real number.
      })
    })
  })
})
