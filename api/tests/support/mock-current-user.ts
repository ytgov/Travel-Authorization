import { Request, Response, NextFunction } from "express"

import { checkJwt } from "@/middleware/jwt-middleware"
import {
  authorizationMiddleware,
  type AuthorizationRequest,
} from "@/middleware/authorization-middleware"

import { User } from "@/models"

jest.mock("@/middleware/jwt-middleware")
jest.mock("@/middleware/authorization-middleware")

/**
 * Usage:
 * At the top level of a test file add:
 *   jest.mock("@/middleware/authorization-middleware")
 *
 * Then where you want to set the current user:
 *   mockCurrentUser(currentUser)
 *
 * @param newCurrentUser - The user to set as the current user
 */
export function mockCurrentUser(newCurrentUser: User) {
  const mockedCheckJwtMiddleware = jest.mocked(checkJwt)
  mockedCheckJwtMiddleware.mockImplementation(
    async (req: Request, res: Response, next: NextFunction) => next()
  )
  const mockedAuthorizationMiddleware = jest.mocked(authorizationMiddleware)
  mockedAuthorizationMiddleware.mockImplementation(
    async (req: AuthorizationRequest, res: Response, next: NextFunction) => {
      req.user = newCurrentUser
      next()
    }
  )
}
