import { Router, Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { DatabaseError } from "sequelize"

import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import {
  ExpensesController,
  LocationsController,
  PreApprovedTravelersController,
  PreApprovedTravelRequestsController,
  Qa,
  StopsController,
  TravelAuthorizations,
  TravelAuthorizationsController,
  TravelPurposesController,
  Users,
  UsersController,
} from "@/controllers"
import { healthCheckRouter } from "./healthcheck-router"

export * from "./owner-router"
export * from "./users-router"
export * from "./lookup-router"
export * from "./healthcheck-router"
export * from "./form-router"
export { migrateRouter } from "./migrate-router"
export * from "./preapproved-router"
export * from "./traveldesk-router"
export * from "./travCom-router"
export * from "./reconcile-router"
export * from "./lookup-tables-router"
// export * from "./tmp-travCom-router"

const router = Router()

router.use("/api", checkJwt)
router.use("/api", loadUser)

// TODO: move all routing logic to this file, and move all route actions into controllers
// TODO: convert all routes to use the router.route(/path).action(...).action(...) syntax
router.get("/api/expenses", ExpensesController.index)
router.post("/api/expenses", ExpensesController.create)
router.patch("/api/expenses/:expenseId", ExpensesController.update)
router.delete("/api/expenses/:expenseId", ExpensesController.destroy)
router.get("/api/stops", StopsController.index)
router.get("/api/travel-authorizations", TravelAuthorizationsController.index)
router.post("/api/travel-authorizations", TravelAuthorizationsController.create)
router.get("/api/travel-authorizations/:travelAuthorizationId", TravelAuthorizationsController.show)
router.patch(
  "/api/travel-authorizations/:travelAuthorizationId",
  TravelAuthorizationsController.update
)
router.delete(
  "/api/travel-authorizations/:travelAuthorizationId",
  TravelAuthorizationsController.destroy
)
router.post(
  "/api/travel-authorizations/:travelAuthorizationId/estimates/generate",
  TravelAuthorizations.Estimates.GenerateController.create
)
router.post(
  "/api/travel-authorizations/:travelAuthorizationId/approve",
  TravelAuthorizations.ApproveController.create
)
router.post(
  "/api/travel-authorizations/:travelAuthorizationId/deny",
  TravelAuthorizations.DenyController.create
)
router.get("/api/locations", LocationsController.index)
router.get("/api/pre-approved-travelers", PreApprovedTravelersController.index)
router.get("/api/pre-approved-travel-requests", PreApprovedTravelRequestsController.index)
router.get("/api/users/:userId", UsersController.show)
router.post(
  "/api/users/:userId/yg-government-directory-sync",
  Users.YgGovernmentDirectorySyncController.create
)
router.get("/api/travel-purposes", TravelPurposesController.index)

// QA testing scenarios
router.get("/api/qa/scenarios", Qa.ScenariosController.index)
router.post(
  `/api/qa/scenarios/${Qa.ScenarioTypes.MY_TRAVEL_REQUESTS}`,
  Qa.Scenarios.MyTravelRequestsController.create
)
router.post(
  `/api/qa/scenarios/${Qa.ScenarioTypes.BECOME_ADMIN_ROLE}`,
  Qa.Scenarios.BecomeAdminRoleController.create
)
router.post(
  `/api/qa/scenarios/${Qa.ScenarioTypes.BECOME_USER_ROLE}`,
  Qa.Scenarios.BecomeUserRoleController.create
)

router.use("/api/health-check", healthCheckRouter)

// if no other routes match, return a 404
router.use("/api", (req: Request, res: Response) => {
  return res.status(404).json({ message: "Not Found" })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
router.use("/api", (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof DatabaseError) {
    console.error(err)
    return res.status(422).json({ message: "Invalid query against database." })
  }

  console.error(err)
  return res.status(500).json({ message: "Internal Server Error" })
})

export default router
