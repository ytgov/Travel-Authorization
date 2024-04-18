import { yukonGovernmentIntegration } from "@/integrations/yukon-government-integration"
import { TravelAuthorization, TravelDeskTravelRequest, TravelSegment } from "@/models"
import { ApproveService } from "@/services/travel-authorizations"
import {
  travelAuthorizationFactory,
  travelPurposeFactory,
  travelSegmentFactory,
  userFactory,
} from "@/factories"

jest.mock("@/integrations/yukon-government-integration.ts")

describe("api/src/services/travel-authorizations/approve-service.ts", () => {
  describe("ApproveService#perform", () => {
    let mockedYukonGovernmentIntegration: jest.MockedObjectDeep<typeof yukonGovernmentIntegration>

    beforeEach(() => {
      mockedYukonGovernmentIntegration = jest.mocked(yukonGovernmentIntegration)
    })

    test("when travel authorization is in a submitted state, it updates the status to approved", async () => {
      // Arrange
      const approver = await userFactory.create()
      const user = await userFactory.create()
      const travelSegments = travelSegmentFactory.buildList(3)
      const purpose = await travelPurposeFactory.create()
      const travelAuthorization = await travelAuthorizationFactory
        .associations({
          purpose,
          travelSegments,
          user,
        })
        .create({
          status: TravelAuthorization.Statuses.SUBMITTED,
        })

      // Act
      const updatedTravelAuthorization = await ApproveService.perform(travelAuthorization, approver)

      // Assert
      expect(updatedTravelAuthorization).toEqual(
        expect.objectContaining({
          id: travelAuthorization.id,
          status: TravelAuthorization.Statuses.APPROVED,
        })
      )
    })

    test("when travel authorization is not in a submitted state, it errors informatively", async () => {
      // Arrange
      const approver = await userFactory.create()
      const user = await userFactory.create()
      const travelSegments = travelSegmentFactory.buildList(3)
      const purpose = await travelPurposeFactory.create()
      const travelAuthorization = await travelAuthorizationFactory
        .associations({
          purpose,
          travelSegments,
          user,
        })
        .create({
          status: TravelAuthorization.Statuses.APPROVED,
        })

      expect.assertions(1)
      try {
        // Act
        await ApproveService.perform(travelAuthorization, approver)
      } catch (error) {
        // Assert
        expect(error).toEqual(
          new Error("Travel authorization must be in submitted state to approve.")
        )
      }
    })

    test("when travel is by air, and employee not found in directory, it creates a travel desk travel request", async () => {
      // Arrange
      const approver = await userFactory.create()
      const user = await userFactory.create()
      const travelSegments = travelSegmentFactory.buildList(3, {
        modeOfTransport: TravelSegment.TravelMethods.AIRCRAFT,
      })
      const purpose = await travelPurposeFactory.create()
      const travelAuthorization = await travelAuthorizationFactory
        .associations({
          purpose,
          travelSegments,
          user,
        })
        .create({
          status: TravelAuthorization.Statuses.SUBMITTED,
        })

      mockedYukonGovernmentIntegration.fetchEmployee.mockResolvedValue(null)

      // Act
      await ApproveService.perform(travelAuthorization, approver)

      // Assert
      expect.assertions(1)
      const travelDeskTravelRequest = await TravelDeskTravelRequest.findOne({
        where: {
          travelAuthorizationId: travelAuthorization.id,
        },
      })
      expect(travelDeskTravelRequest).toEqual(
        expect.objectContaining({
          travelAuthorizationId: travelAuthorization.id,
          legalFirstName: user.firstName,
          legalLastName: user.lastName,
          strAddress: "",
          city: "",
          province: "",
          postalCode: "",
          busPhone: "",
          busEmail: "",
          travelPurpose: purpose.purpose,
          status: TravelDeskTravelRequest.Statuses.DRAFT,
        })
      )
    })
  })
})
