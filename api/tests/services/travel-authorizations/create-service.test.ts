import { faker } from "@faker-js/faker"

import { User } from "@/models"
import { Users } from "@/services"
import { CreateService } from "@/services/travel-authorizations"

import { travelAuthorizationFactory, userFactory } from "@/factories"

describe("api/src/services/travel-authorizations/create-service.ts", () => {
  const userEnsureServicePerformMock = jest.fn()

  beforeEach(async () => {
    Users.EnsureService.perform = userEnsureServicePerformMock
  })

  describe("CreateService", () => {
    describe(".perform", () => {
      test("when creator is admin, and user attributes are supplied, it calls EnsureUser with those attributes", async () => {
        // Arrange
        const email = faker.internet.email().toLowerCase()
        userEnsureServicePerformMock.mockImplementation(() => {
          return userFactory.create({
            email,
          })
        })
        const { dataValues: travelAuthorizationAttributes } = travelAuthorizationFactory
          .transient({ roundTrip: true })
          .build()
        const creator = await userFactory.create({
          roles: [User.Roles.ADMIN],
        })
        const userAttributes = { email }

        // Act
        const travelAuthorization = await CreateService.perform(
          { ...travelAuthorizationAttributes, userAttributes },
          creator
        )

        // Assert
        expect.assertions(2)
        expect(userEnsureServicePerformMock).toHaveBeenCalledWith(userAttributes, creator)
        expect(travelAuthorization).toEqual(
          expect.objectContaining({
            user: expect.objectContaining({
              email,
            }),
          })
        )
      })

      test("when creator is admin, and user attributes are not supplied, it does not call EnsureUser", async () => {
        // Arrange
        const user = await userFactory.create()
        const { dataValues: travelAuthorizationAttributes } = travelAuthorizationFactory
          .params({ userId: user.id })
          .transient({ roundTrip: true })
          .build()
        const creator = await userFactory.create({
          roles: [User.Roles.ADMIN],
        })

        // Act
        const travelAuthorization = await CreateService.perform(
          travelAuthorizationAttributes,
          creator
        )

        // Assert
        expect.assertions(2)
        expect(userEnsureServicePerformMock).not.toHaveBeenCalled()
        expect(travelAuthorization).toEqual(
          expect.objectContaining({
            user: expect.objectContaining({
              email: user.email,
            }),
          })
        )
      })

      test("when creator is not admin, and user attributes are supplied, it does not call EnsureUser", async () => {
        // Arrange
        const user = await userFactory.create()
        const { dataValues: travelAuthorizationAttributes } = travelAuthorizationFactory
          .params({ userId: user.id })
          .transient({ roundTrip: true })
          .build()
        const creator = await userFactory.create({
          roles: [User.Roles.USER],
        })

        // Act
        const travelAuthorization = await CreateService.perform(
          travelAuthorizationAttributes,
          creator
        )

        // Assert
        expect.assertions(2)
        expect(userEnsureServicePerformMock).not.toHaveBeenCalled()
        expect(travelAuthorization).toEqual(
          expect.objectContaining({
            user: expect.objectContaining({
              email: creator.email,
            }),
          })
        )
      })
    })
  })
})
