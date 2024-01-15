import { faker } from "@faker-js/faker"

import { travelAuthorizationFactory, travelSegmentFactory } from "@/factories"
import { TravelAuthorization } from "@/models"
import { TravelAuthorizationsSerializer } from "@/serializers"

describe("api/src/serializers/travel-authorizations-serializer.ts", () => {
  describe("TravelAuthorizationsSerializer", () => {
    describe("#asTableRow", () => {
      test("when travel authorization is pending approval, and travelling is complete the travel action is blank", async () => {
        const travelSegment = travelSegmentFactory.build({
          departureOn: faker.date.past(),
        })
        const travelAuthorization = await travelAuthorizationFactory
          .associations({
            travelSegments: [travelSegment],
          })
          .transient({
            include: ["user", "travelSegments"],
          })
          .create({
            status: TravelAuthorization.Statuses.SUBMITTED,
          })

        const serializer = new TravelAuthorizationsSerializer(travelAuthorization)

        expect(serializer.asTableRow()).toEqual(
          expect.objectContaining({
            phase: "travel_approval",
            action: [],
          })
        )
      })

      test("when travel authorization is approved, and travelling is complete, the travel action includes submit_expense_claim", async () => {
        const travelSegment = travelSegmentFactory.build({
          departureOn: faker.date.past(),
        })
        const travelAuthorization = await travelAuthorizationFactory
          .associations({
            travelSegments: [travelSegment],
          })
          .transient({
            include: ["user", "travelSegments"],
          })
          .create({
            status: TravelAuthorization.Statuses.APPROVED,
          })

        const serializer = new TravelAuthorizationsSerializer(travelAuthorization)

        expect(serializer.asTableRow()).toEqual(
          expect.objectContaining({
            phase: "travel_complete",
            action: ["submit_expense_claim"],
          })
        )
      })
    })
  })
})
