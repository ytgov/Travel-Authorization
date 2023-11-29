import request from "supertest"
import { Request, Response, NextFunction } from "express"

import app from "@/app"
import { BulkGenerateService } from "@/services/estimates"
import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import { TravelAuthorization, User } from "@/models"
import { travelAuthorizationFactory, userFactory } from "@/factories"

// TODO: add some kind of helper that globally mocks authz.middleware for all api tests
jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: jest.fn(),
  loadUser: jest.fn(),
}))
jest.mock("@/services/estimates", () => ({ BulkGenerateService: { perform: jest.fn() } }))

const mockedCheckJwt = checkJwt as unknown as jest.Mock
const mockedLoadUser = loadUser as unknown as jest.Mock
const mockedBulkGenerateServicePerform = BulkGenerateService.perform as unknown as jest.Mock

describe("api/src/controllers/travel-authorizations/estimates/generate-controller.ts", () => {
  let user: User

  beforeEach(async () => {
    mockedCheckJwt.mockImplementation((req: Request, res: Response, next: NextFunction) => next())

    user = await userFactory.create({
      roles: [User.Roles.USER],
    })
    mockedLoadUser.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = user
      next()
    })
  })

  describe("POST /api/travel-authorizations/:travelAuthorizationId/estimates/generate", () => {
    test("when authorized and bulk generation is successful", async () => {
      const travelAuthorization = await travelAuthorizationFactory.create(
        {
          status: TravelAuthorization.Statuses.DRAFT,
        },
        { associations: { user } }
      )

      const mockBulkGenerateServicePerformResponse = "mock bulk generate response"
      mockedBulkGenerateServicePerform.mockImplementation(() => {
        return Promise.resolve(mockBulkGenerateServicePerformResponse)
      })

      return request(app)
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(201, { estimates: mockBulkGenerateServicePerformResponse, message: "Generated estimates" })
    })

    test("when authorized and bulk generation not is successful", async () => {
      const travelAuthorization = await travelAuthorizationFactory.create(
        {
          status: TravelAuthorization.Statuses.DRAFT,
        },
        { associations: { user } }
      )

      const mockBulkGenerateServicePerformResponse = "mock bulk generate response"
      mockedBulkGenerateServicePerform.mockImplementation(() => {
        return Promise.reject(mockBulkGenerateServicePerformResponse)
      })

      return request(app)
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(422, { message: `Failed to generate estimate: ${mockBulkGenerateServicePerformResponse}` })
    })

    test("when not authorized", async () => {
      const travelAuthorization = await travelAuthorizationFactory.create(
        {
          status: TravelAuthorization.Statuses.SUBMITTED,
        },
        { associations: { user } }
      )

      return request(app)
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(403, { message: "You are not authorized to create this expense." })
    })

    test("when travel authorization does not exist", async () => {
      const invalidTravelAuthorizationId = -1
      return request(app)
        .post(`/api/travel-authorizations/${invalidTravelAuthorizationId}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(404, { message: "Travel authorization not found." })
    })
  })
})
