import { Request, Response, NextFunction } from "express"

import { checkJwt, loadUser, type AuthorizationRequest } from "@/middleware/authz.middleware"

import { User } from "@/models"

jest.mock("@/middleware/authz.middleware")

/**
 * Usage:
 * At the top level of a test file add:
 *   jest.mock("@/middleware/authz.middleware")
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
  const mockedLoadUser = jest.mocked(loadUser)
  mockedLoadUser.mockImplementation(
    async (req: AuthorizationRequest, res: Response, next: NextFunction) => {
      req.user = newCurrentUser
      next()
    }
  )
}
