import { Response, NextFunction } from "express"
import { User } from "@/models"
import { auth0Integration, type Auth0UserInfo } from "@/integrations/auth0-integration"
import {
  authorizationMiddleware,
  type AuthorizationRequest,
} from "@/middleware/authorization-middleware"

jest.unmock("@/middleware/authorization-middleware")

jest.mock("@/integrations/auth0-integration")
jest.mock("@/utils/logger")

let user_data: Auth0UserInfo
let req: Partial<AuthorizationRequest>
let res: Partial<Response>
let next: NextFunction

beforeEach(() => {
  user_data = {
    email: "dupe@test.com",
    firstName: "dupe",
    lastName: "UNKNOWN",
    auth0Subject: "",
  }

  req = {
    headers: {
      authorization: "mock-token",
    },
    auth: {},
  }

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }

  next = jest.fn()
})

async function setupRaceCondition(auth0Subject: string, attempts: number) {
  user_data.auth0Subject = auth0Subject
  req.auth = { sub: auth0Subject }

  // force a "new" user in the middleware
  jest.spyOn(auth0Integration, "getUserInfo").mockResolvedValue(user_data)

  // Act
  const funcs = Array.from({ length: attempts }, async () => {
    await authorizationMiddleware(req as AuthorizationRequest, res as Response, next)
  })

  await Promise.all(funcs)
}

describe("api/src/middleware/authorization-middleware.ts", () => {
  describe(".authorizationMiddleware", () => {
    test.each([
      [1, "auth0|00001"],
      [2, "auth0|00002"],
      [5, "auth0|00003"],
      [10, "auth0|00004"],
    ])(
      "when create %i users, only one user should be created",
      async (attempts: number, auth0Subject: string) => {
        // Act
        await setupRaceCondition(auth0Subject, attempts)

        // Assert
        const users = await User.findAll({
          where: {
            sub: auth0Subject,
          },
        })

        expect(users.length).toEqual(1)
        expect(users[0]).toHaveProperty("sub", auth0Subject)
      }
    )
  })
})
