import { Request, Response, NextFunction } from "express"
import request from "supertest"

import app from "@/app"
import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import { Expense, TravelAuthorization, User } from "@/models"
import { expenseFactory, travelAuthorizationFactory, userFactory } from "@/factories"

// TODO: add some kind of helper that globally mocks authz.middleware for all api tests
jest.mock("@/middleware/authz.middleware", () => ({
  checkJwt: jest.fn(),
  loadUser: jest.fn(),
}))
const mockedCheckJwt = checkJwt as unknown as jest.Mock
const mockedLoadUser = loadUser as unknown as jest.Mock

describe("api/src/controllers/expenses-controller.ts", () => {
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

  describe("ExpensesController", () => {
    describe("#create - POST /api/expenses", () => {
      test("when authorized and expense creation is successful", async () => {
        // Arrange
        const travelAuthorization = await travelAuthorizationFactory.associations({ user }).create({
          status: TravelAuthorization.Statuses.DRAFT,
        })
        const newExpenseAttributes = expenseFactory.attributesFor({
          travelAuthorizationId: travelAuthorization.id,
          type: Expense.Types.EXPENSE,
          currency: "CAD",
          expenseType: Expense.ExpenseTypes.ACCOMMODATIONS,
          description: "Hotel in Vancouver",
          cost: 250.0,
          date: new Date("2023-12-22"),
        })

        // Act
        const response = await request(app)
          .post("/api/expenses")
          .send(newExpenseAttributes)

        // Assert
        expect(response.status).toEqual(201)
        expect(response.body).toEqual({
          expense: expect.objectContaining({
            travelAuthorizationId: travelAuthorization.id,
            type: Expense.Types.EXPENSE,
            currency: "CAD",
            expenseType: Expense.ExpenseTypes.ACCOMMODATIONS,
            description: "Hotel in Vancouver",
            cost: 250.0,
            date: "2023-12-22",
          }),
        })
      })
    })
  })
})
