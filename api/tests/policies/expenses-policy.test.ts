import { faker } from "@faker-js/faker"

import { ExpensesPolicy } from "@/policies"
import { TravelAuthorization, User } from "@/models"
import {
  expenseFactory,
  travelAuthorizationFactory,
  travelSegmentFactory,
  userFactory,
} from "@/factories"

describe("api/src/policies/expenses-policy.ts", () => {
  describe("ExpensesPolicy", () => {
    describe("create", () => {
      test("when travel authorization is approved and current date is after travel start date, returns true", () => {
        const user = userFactory.build({
          roles: [User.Roles.USER],
        })
        const travelAuthorization = travelAuthorizationFactory.build({
          status: TravelAuthorization.Statuses.APPROVED,
          userId: user.id,
        })
        const travelSegment = travelSegmentFactory.build({
          travelAuthorization,
          departureOn: faker.date.past(),
        })
        travelAuthorization.travelSegments = [travelSegment]
        const expense = expenseFactory.build({
          travelAuthorization,
        })

        const policy = new ExpensesPolicy(user, expense)

        expect(policy.create()).toBe(true)
      })

      test("when travel authorization is approved and current date is not after travel start date, returns false", () => {
        const user = userFactory.build({
          roles: [User.Roles.USER],
        })
        const travelAuthorization = travelAuthorizationFactory.build({
          status: TravelAuthorization.Statuses.APPROVED,
          userId: user.id,
        })
        const travelSegment = travelSegmentFactory.build({
          travelAuthorization,
          departureOn: faker.date.future(),
        })
        travelAuthorization.travelSegments = [travelSegment]
        const expense = expenseFactory.build({
          travelAuthorization,
        })

        const policy = new ExpensesPolicy(user, expense)

        expect(policy.create()).toBe(false)
      })

      test("when travel authorization is draft, returns false", () => {
        const user = userFactory.build({
          roles: [User.Roles.USER],
        })
        const travelAuthorization = travelAuthorizationFactory.build({
          status: TravelAuthorization.Statuses.DRAFT,
          userId: user.id,
        })
        const travelSegment = travelSegmentFactory.build({
          travelAuthorization,
          departureOn: faker.date.past(),
        })
        travelAuthorization.travelSegments = [travelSegment]
        const expense = expenseFactory.build({
          travelAuthorization,
        })

        const policy = new ExpensesPolicy(user, expense)

        expect(policy.create()).toBe(false)
      })
    })
  })
})
