import { ClaimTypes } from "@/models/per-diem"
import { determineClaimTypes } from "@/services/estimates/bulk-generate"

/*
Requirements:
1. On the first day of travel:
  1. Where travel starts after 8am the traveler will not receive breakfast.
  2. Where travel starts after 1pm the traveler will not receive breakfast or lunch.
  3. Where travel starts after 7pm the traveler will not receive any per diem.
      > these rules are going to be slightly different when we look at air travel as travelers need to be at the airport 2 hours early but for the estimates this will work as we are not clear on exact travel times
  4. No incidentals can be claimed this day.

4. On the second and subsequent days of travel:
  1. The traveler will receive the full per diem including incidentals.

5. On the last day of travel:
  1. Where travel ends at 10am the traveler will receive only breakfast
  2. Where travel ends at 2pm the traveler will receive breakfast and lunch
  3. Where travel ends at 7pm the traveler will receive breakfast, lunch and supper
  4. Incidental can be claimed this day regardless of arrival time.
*/
describe("api/src/services/estimates/bulk-generate/determine-claim-types.ts", () => {
  describe(".determineClaimTypes", () => {
    describe("on the first day of travel", () => {
      // TODO: validate these tests
      test.each([
        {
          travelStartAt: new Date("2022-06-05 07:59:00"),
          travelEndAt: new Date("2022-06-06 00:00:00"),
          expected: [ClaimTypes.BREAKFAST, ClaimTypes.LUNCH, ClaimTypes.DINNER],
        },
        {
          travelStartAt: new Date("2022-06-05 08:00:00"),
          travelEndAt: new Date("2022-06-06 00:00:00"),
          expected: [ClaimTypes.LUNCH, ClaimTypes.DINNER],
        },
        {
          travelStartAt: new Date("2022-06-05 13:00:00"),
          travelEndAt: new Date("2022-06-06 00:00:00"),
          expected: [ClaimTypes.DINNER],
        },
        {
          travelStartAt: new Date("2022-06-05 19:00:00"),
          travelEndAt: new Date("2022-06-06 00:00:00"),
          expected: [],
        },
      ])(
        "determineClaimTypes($travelStartAt, $travelEndAt)",
        ({ travelStartAt, travelEndAt, expected }) => {
          expect(determineClaimTypes(travelStartAt, travelEndAt, { isFirstDay: true })).toEqual(
            expected
          )
        }
      )
    })

    describe("on the second and subsequent days of travel", () => {
      // TODO: validate this tests
      test("full per diem including incidentals", () => {
        const travelStartAt = new Date("2022-06-05 00:00:00")
        const travelEndAt = new Date("2022-06-07 00:00:00")
        const expected = ["MAXIMUM_DAILY", "INCIDENTALS"]
        expect(determineClaimTypes(travelStartAt, travelEndAt)).toEqual(expected)
      })
    })

    describe("on the last day of travel", () => {
      // TODO: validate these tests
      test.each([
        {
          travelStartAt: new Date("2022-06-05 00:00:00"),
          travelEndAt: new Date("2022-06-05 10:00:00"),
          expected: ["BREAKFAST"],
        },
        {
          travelStartAt: new Date("2022-06-05 00:00:00"),
          travelEndAt: new Date("2022-06-05 14:00:00"),
          expected: ["BREAKFAST", "LUNCH"],
        },
        {
          travelStartAt: new Date("2022-06-05 00:00:00"),
          travelEndAt: new Date("2022-06-05 19:00:00"),
          expected: ["BREAKFAST", "LUNCH", "DINNER"],
        },
      ])(
        "determineClaimTypes($travelStartAt, $travelEndAt)",
        ({ travelStartAt, travelEndAt, expected }) => {
          expect(determineClaimTypes(travelStartAt, travelEndAt, { isLastDay: true })).toEqual(
            expected
          )
        }
      )
    })
  })
})
