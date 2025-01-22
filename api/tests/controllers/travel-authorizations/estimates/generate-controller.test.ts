import { BulkGenerateService } from "@/services/estimates"
import { TravelAuthorization, User } from "@/models"
import { travelAuthorizationFactory, userFactory } from "@/factories"

import { mockCurrentUser, request, testWithCustomLogLevel } from "@/support"

vi.mock("@/services/estimates", () => ({ BulkGenerateService: { perform: vi.fn() } }))

const mockedBulkGenerateServicePerform = vi.mocked(BulkGenerateService.perform)

describe("api/src/controllers/travel-authorizations/estimates/generate-controller.ts", () => {
  let user: User

  beforeEach(async () => {
    user = await userFactory.create({
      roles: [User.Roles.USER],
    })
    mockCurrentUser(user)
  })

  describe("POST /api/travel-authorizations/:travelAuthorizationId/estimates/generate", () => {
    test("when authorized and bulk generation is successful", async () => {
      const travelAuthorization = await travelAuthorizationFactory.associations({ user }).create({
        status: TravelAuthorization.Statuses.DRAFT,
      })

      const mockBulkGenerateServicePerformResponse = "mock bulk generate response"
      mockedBulkGenerateServicePerform.mockImplementation(() => {
        return Promise.resolve(mockBulkGenerateServicePerformResponse)
      })

      return request()
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(201, {
          estimates: mockBulkGenerateServicePerformResponse,
          message: "Generated estimates",
        })
    })

    testWithCustomLogLevel(
      "when authorized and bulk generation not is successful",
      async ({ setLogLevel }) => {
        // Arrange
        setLogLevel("silent")

        const travelAuthorization = await travelAuthorizationFactory.associations({ user }).create({
          status: TravelAuthorization.Statuses.DRAFT,
        })

        const mockBulkGenerateServicePerformResponse = "mock bulk generate response"
        mockedBulkGenerateServicePerform.mockImplementation(() => {
          return Promise.reject(mockBulkGenerateServicePerformResponse)
        })

        // Act
        const response = await request().post(
          `/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`
        )
        // Assert
        expect(response.status).toEqual(422)
        expect(response.body).toMatchObject({
          message: `Failed to generate estimate: ${mockBulkGenerateServicePerformResponse}`,
        })
      }
    )

    test("when not authorized", async () => {
      const otherUser = await userFactory.create({
        roles: [User.Roles.USER],
      })
      const travelAuthorization = await travelAuthorizationFactory
        .associations({
          user: otherUser,
        })
        .create({
          status: TravelAuthorization.Statuses.SUBMITTED,
        })

      mockedBulkGenerateServicePerform.mockImplementation(() => {
        return Promise.resolve("should never get here")
      })

      return request()
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(403, {
          message: "You are not authorized to create this expense.",
        })
    })

    test("when travel authorization does not exist", async () => {
      const invalidTravelAuthorizationId = -1
      return request()
        .post(`/api/travel-authorizations/${invalidTravelAuthorizationId}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(404, { message: "Travel authorization not found." })
    })
  })
})
