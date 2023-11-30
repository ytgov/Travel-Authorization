import { BulkGenerate } from "@/services/estimates"

describe("api/src/services/estimates/bulk-generate/calculate-number-of-nights.ts", () => {
  describe(".calculateNumberOfNights", () => {
    test.each([
      {
        arrivalAt: new Date("2022-06-05 00:00:00"),
        departureAt: new Date("2022-06-07 12:00:00"),
        expected: 2,
      },
      {
        arrivalAt: new Date("2022-06-05 23:00:00"),
        departureAt: new Date("2022-06-07 07:00:00"),
        expected: 2,
      },
    ])(
      "calculateNumberOfNights($arrivalAt, $departureAt)",
      ({ arrivalAt, departureAt, expected }) => {
        expect(BulkGenerate.calculateNumberOfNights(arrivalAt, departureAt)).toBe(expected)
      }
    )
  })
})
