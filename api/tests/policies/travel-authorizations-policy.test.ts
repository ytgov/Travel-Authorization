import { User } from "@/models"
import { TravelAuthorizationsPolicy } from "@/policies"

import { travelAuthorizationFactory, userFactory } from "@/factories"

describe("api/src/policies/travel-authorizations-policy.ts", () => {
  describe("TravelAuthorizationsPolicy", () => {
    describe("#permittedAttributesForCreate", () => {
      test("when user is admin, creation attributes include user attributes and userId", () => {
        const admin = userFactory.build({ roles: [User.Roles.ADMIN] })
        const travelAuthorization = travelAuthorizationFactory.build()

        const policy = new TravelAuthorizationsPolicy(admin, travelAuthorization)

        expect(policy.permittedAttributesForCreate()).toEqual(
          expect.arrayContaining(["userId", "userAttributes"])
        )
      })

      test("when user is not an admin, creation attributes do not include user attributes and userId", () => {
        const admin = userFactory.build({ roles: [User.Roles.USER] })
        const travelAuthorization = travelAuthorizationFactory.build()

        const policy = new TravelAuthorizationsPolicy(admin, travelAuthorization)

        expect(policy.permittedAttributesForCreate()).not.toEqual(
          expect.arrayContaining(["userId", "userAttributes"])
        )
      })
    })
  })
})
