import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

import { User } from "@/models"

export { loadUser, checkJwt } from "./authz.middleware"
export { databaseHealthCheckMiddleware } from "./database-health-check-middleware"
export { requestLoggerMiddleware } from "./request-logger-middleware"

export function RequiresAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(401).send("You are not authorized to view this page")
}

export function ReturnValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    })
  }

  next()
}

export function RequiresRoleAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.roles.indexOf(User.Roles.ADMIN) == -1) {
    return res.status(401).send("You are not an Administrator")
  }

  next()
}

export function RequiresAuth(_req: Request, _res: Response, next: NextFunction) {
  // if (req.isAuthenticated()) {
  return next()
  // }

  // res.redirect("/api/auth/login");
}

export function RequiresRolePatAdminOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (
    req.user &&
    (req.user.roles.indexOf(User.Roles.ADMIN) >= 0 ||
      req.user.roles.indexOf(User.Roles.PAT_ADMIN) >= 0)
  ) {
    return next()
  }
  return res.status(401).send("You are not an Administrator for Pre-Approval Travel Requests!")
}

export function RequiresRoleTdUser(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.roles.indexOf(User.Roles.TD_USER) >= 0) {
    return next()
  }
  return res.status(401).send("You are not a Travel Desk User!")
}

export function RequiresRoleTdUserOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (
    req.user &&
    (req.user.roles.indexOf(User.Roles.ADMIN) >= 0 ||
      req.user.roles.indexOf(User.Roles.TD_USER) >= 0)
  ) {
    return next()
  }
  return res.status(401).send("You are not an Administrator or Travel Desk User!")
}
