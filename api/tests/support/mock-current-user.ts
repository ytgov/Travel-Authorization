import { Request, Response, NextFunction } from "express"

import {
  authorizationMiddleware,
  type AuthorizationRequest,
} from "@/middleware/authorization-middleware"

import { User } from "@/models"

/**
 * Usage:
 * At the top level of a test file import:
 *   import { mockCurrentUser } from "@/support"
 *
 * Then where you want to set the current user:
 *   mockCurrentUser(currentUser)
 *
 * @param newCurrentUser - The user to set as the current user
 */
export function mockCurrentUser(newCurrentUser: User) {
  vi.mock("@/middleware/jwt-middleware", () => ({
    default: async (_req: Request, _res: Response, next: NextFunction) => next(),
    checkJwt: async (_req: Request, _res: Response, next: NextFunction) => next(),
  }))

  vi.mock("@/middleware/authorization-middleware")
  const authorizationMiddlewareMock = vi.mocked(authorizationMiddleware)
  authorizationMiddlewareMock.mockImplementation(
    async (req: AuthorizationRequest, _res: Response, next: NextFunction) => {
      req.user = newCurrentUser
      next()
    }
  )
}
