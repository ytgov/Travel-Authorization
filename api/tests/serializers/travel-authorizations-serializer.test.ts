import { travelAuthorizationFactory } from "@/factories"
import { TravelAuthorization } from "@/models"
import { TravelAuthorizationsSerializer } from "@/serializers"

describe("api/src/serializers/travel-authorizations-serializer.ts", () => {
  describe("TravelAuthorizationsSerializer", () => {
    describe("#asTableRow", () => {
      test("when travel authorization is pending approval, and traveling is complete, the travel action is blank", async () => {
        const travelAuthorization = await travelAuthorizationFactory
          .transient({
            include: ["user"],
          })
          .create({
            status: TravelAuthorization.Statuses.SUBMITTED,
          })

        const serializer = new TravelAuthorizationsSerializer(travelAuthorization)

        expect(serializer.asTableRow()).toEqual(
          expect.objectContaining({
            phase: "travel_planning",
            action: [],
          })
        )
      })

      test("when travel authorization is approved, traveling is complete, the travel action includes submit_expense_claim", async () => {
        const travelAuthorization = await travelAuthorizationFactory
          .transient({
            include: ["user"],
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
