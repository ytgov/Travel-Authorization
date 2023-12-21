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

router.use("/api", checkJwt, loadUser)

// TODO: move all routing logic to this file, and move all route actions into controllers
// TODO: convert all routes to use the router.route(/path).action(...).action(...) syntax
router.route("/api/expenses").get(ExpensesController.index).post(ExpensesController.create)
router
  .route("/api/expenses/:expenseId")
  .patch(ExpensesController.update)
  .delete(ExpensesController.destroy)

router.route("/api/stops").get(StopsController.index)

router
  .route("/api/travel-authorizations")
  .get(TravelAuthorizationsController.index)
  .post(TravelAuthorizationsController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId")
  .get(TravelAuthorizationsController.show)
  .patch(TravelAuthorizationsController.update)
  .delete(TravelAuthorizationsController.destroy)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/approve")
  .post(TravelAuthorizations.ApproveController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/deny")
  .post(TravelAuthorizations.DenyController.create)

router
  .route("/api/travel-authorizations/:travelAuthorizationId/estimates/generate")
  .post(TravelAuthorizations.Estimates.GenerateController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/expenses/prefill")
  .post(TravelAuthorizations.Expenses.PrefillController.create)

router.route("/api/locations").get(LocationsController.index)
router.route("/api/pre-approved-travelers").get(PreApprovedTravelersController.index)
router.route("/api/pre-approved-travel-requests").get(PreApprovedTravelRequestsController.index)

router.route("/api/users/:userId").get(UsersController.show)
router
  .route("/api/users/:userId/yg-government-directory-sync")
  .post(Users.YgGovernmentDirectorySyncController.create)
router.route("/api/travel-purposes").get(TravelPurposesController.index)

// QA testing scenarios
router.route("/api/qa/scenarios").get(Qa.ScenariosController.index)
router
  .route(`/api/qa/scenarios/${Qa.ScenarioTypes.MY_TRAVEL_REQUESTS}`)
  .post(Qa.Scenarios.MyTravelRequestsController.create)
router
  .route(`/api/qa/scenarios/${Qa.ScenarioTypes.BECOME_ADMIN_ROLE}`)
  .post(Qa.Scenarios.BecomeAdminRoleController.create)
router
  .route(`/api/qa/scenarios/${Qa.ScenarioTypes.BECOME_USER_ROLE}`)
  .post(Qa.Scenarios.BecomeUserRoleController.create)

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
