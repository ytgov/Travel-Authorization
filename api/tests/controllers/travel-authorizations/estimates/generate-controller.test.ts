import request from "supertest"
import { Request, Response, NextFunction } from "express"

import app from "@/app"
import { travelAuthorizationFactory, userFactory } from "@/factories"
import { checkJwt, loadUser } from "@/middleware/authz.middleware"

jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: jest.fn(),
  loadUser: jest.fn(),
}))

const mockedCheckJwt = checkJwt as unknown as jest.Mock
const mockedLoadUser = loadUser as unknown as jest.Mock

describe("api/src/controllers/travel-authorizations/estimates/generate-controller.ts", () => {
  beforeEach(() => {
    mockedCheckJwt.mockImplementation((req: Request, res: Response, next: NextFunction) => next())
  })

  describe("POST /api/travel-authorizations/:travelAuthorizationId/estimates/generate", () => {
    test.only("when authorized and bulk generation is successful", async () => {
      const user = await userFactory.create()

      mockedLoadUser.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = user
        next()
      })

      const travelAuthorization = await travelAuthorizationFactory.create({ user: user })

      // TODO: mock out the bulk generate service
      const mockBulkGenerateResponse = "mock bulk generate response"

      return request(app)
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(201, { estimates: mockBulkGenerateResponse, message: "Generated estimates" })
    })
  })
})
