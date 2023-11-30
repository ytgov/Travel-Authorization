import { BulkGenerate } from "@/services/estimates"

describe("api/src/services/estimates/bulk-generate/calculate-number-of-days.ts", () => {
  describe(".calculateNumberOfDays", () => {
    test.each([
      {
        arrivalAt: new Date("2022-06-05 00:00:00"),
        departureAt: new Date("2022-06-07 12:00:00"),
        expected: 3,
      },
      {
        arrivalAt: new Date("2022-06-05 23:00:00"),
        departureAt: new Date("2022-06-07 07:00:00"),
        expected: 3,
      },
    ])(
      "calculateNumberOfDays($arrivalAt, $departureAt)",
      ({ arrivalAt, departureAt, expected }) => {
        expect(BulkGenerate.calculateNumberOfDays(arrivalAt, departureAt)).toBe(expected)
      }
    )
  })
})
