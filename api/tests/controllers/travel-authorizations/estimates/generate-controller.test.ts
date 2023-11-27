import request from "supertest"
import { Request, Response, NextFunction } from "express"

import app from "@/app"
import { travelAuthorizationFactory, userFactory } from "@/factories"
import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import { BulkGenerate } from "@/services/estimates"

jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: jest.fn(),
  loadUser: jest.fn(),
}))

jest.mock("@/services/estimates", () => ({ BulkGenerate: { perform: jest.fn() } }))

const mockedCheckJwt = checkJwt as unknown as jest.Mock
const mockedLoadUser = loadUser as unknown as jest.Mock
const mockedBulkGeneratePerform = BulkGenerate.perform as unknown as jest.Mock

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

      const mockBulkGeneratePerformResponse = "mock bulk generate response"
      mockedBulkGeneratePerform.mockImplementation(() => {
        return Promise.resolve(mockBulkGeneratePerformResponse)
      })

      return request(app)
        .post(`/api/travel-authorizations/${travelAuthorization.id}/estimates/generate`)
        .expect("Content-Type", /json/)
        .expect(201, { estimates: mockBulkGeneratePerformResponse, message: "Generated estimates" })
    })
  })
})
