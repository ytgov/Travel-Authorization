import { Router, Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { DatabaseError } from "sequelize"

import { GIT_COMMIT_HASH, RELEASE_TAG } from "@/config"
import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import { healthCheckRouter } from "@/routes/healthcheck-router"
import {
  Expenses,
  ExpensesController,
  GeneralLedgerCodingsController,
  LocationsController,
  TravelAuthorizationPreApprovalProfilesController,
  TravelAuthorizationPreApprovalsController,
  Qa,
  StopsController,
  TravelAuthorizationActionLogsController,
  TravelAuthorizations,
  TravelAuthorizationsController,
  TravelPurposesController,
  Users,
  UsersController,
  TravelDeskTravelRequestsController,
  TravelDeskFlightRequestsController,
  TravelDeskRentalCarsController,
  TravelDeskHotelsController,
  TravelDeskOtherTransportationsController,
  TravelDeskTravelRequests,
} from "@/controllers"

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

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  return res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

// api routes
router.use("/api", checkJwt, loadUser)

// TODO: move all routing logic to this file, and move all route actions into controllers
// TODO: convert all routes to use the router.route(/path).action(...).action(...) syntax
router.route("/api/expenses").get(ExpensesController.index).post(ExpensesController.create)
router
  .route("/api/expenses/:expenseId")
  .patch(ExpensesController.update)
  .delete(ExpensesController.destroy)
router
  .route("/api/expenses/:expenseId/upload")
  .get(Expenses.UploadController.show)
  .post(Expenses.UploadController.create)

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

// Stateful routes for travel authorizations
router
  .route("/api/travel-authorizations/:travelAuthorizationId/submit")
  .post(TravelAuthorizations.SubmitController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/approve")
  .post(TravelAuthorizations.ApproveController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/approve-expense-claim")
  .post(TravelAuthorizations.ApproveExpenseClaimController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/deny")
  .post(TravelAuthorizations.DenyController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/expense-claim")
  .post(TravelAuthorizations.ExpenseClaimController.create)

router
  .route("/api/travel-authorizations/:travelAuthorizationId/estimates/generate")
  .post(TravelAuthorizations.Estimates.GenerateController.create)
router
  .route("/api/travel-authorizations/:travelAuthorizationId/expenses/prefill")
  .post(TravelAuthorizations.Expenses.PrefillController.create)

router
  .route("/api/travel-desk-flight-requests")
  .get(TravelDeskFlightRequestsController.index)
  .post(TravelDeskFlightRequestsController.create)
router
  .route("/api/travel-desk-flight-requests/:travelDeskFlightRequestId")
  .patch(TravelDeskFlightRequestsController.update)
  .delete(TravelDeskFlightRequestsController.destroy)

router
  .route("/api/travel-desk-hotels")
  .get(TravelDeskHotelsController.index)
  .post(TravelDeskHotelsController.create)
router
  .route("/api/travel-desk-hotels/:travelDeskHotelId")
  .patch(TravelDeskHotelsController.update)
  .delete(TravelDeskHotelsController.destroy)

router
  .route("/api/travel-desk-other-transportations")
  .get(TravelDeskOtherTransportationsController.index)
  .post(TravelDeskOtherTransportationsController.create)
router
  .route("/api/travel-desk-other-transportations/:travelDeskOtherTransportationId")
  .patch(TravelDeskOtherTransportationsController.update)
  .delete(TravelDeskOtherTransportationsController.destroy)

router
  .route("/api/travel-desk-rental-cars")
  .get(TravelDeskRentalCarsController.index)
  .post(TravelDeskRentalCarsController.create)
router
  .route("/api/travel-desk-rental-cars/:travelDeskRentalCarId")
  .patch(TravelDeskRentalCarsController.update)
  .delete(TravelDeskRentalCarsController.destroy)

router.route("/api/travel-desk-travel-requests").get(TravelDeskTravelRequestsController.index)
router
  .route("/api/travel-desk-travel-requests/:travelDeskTravelRequestId")
  .get(TravelDeskTravelRequestsController.show)
  .patch(TravelDeskTravelRequestsController.update)
router
  .route("/api/travel-desk-travel-requests/:travelDeskTravelRequestId/submit")
  .post(TravelDeskTravelRequests.SubmitController.create)

router.route("/api/locations").get(LocationsController.index)
router.route("/api/locations/:locationId").get(LocationsController.show)

router
  .route("/api/travel-authorization-pre-approval-profiles")
  .get(TravelAuthorizationPreApprovalProfilesController.index)
router
  .route("/api/travel-authorization-pre-approval-profiles/:id")
  .get(TravelAuthorizationPreApprovalProfilesController.show)

router
  .route("/api/travel-authorization-pre-approvals")
  .get(TravelAuthorizationPreApprovalsController.index)

router.route("/api/users").post(UsersController.create)
router.route("/api/users/:userId").get(UsersController.show)
router
  .route("/api/users/:userId/yg-government-directory-sync")
  .post(Users.YgGovernmentDirectorySyncController.create)
router.route("/api/travel-purposes").get(TravelPurposesController.index)

router
  .route("/api/general-ledger-codings")
  .get(GeneralLedgerCodingsController.index)
  .post(GeneralLedgerCodingsController.create)
router
  .route("/api/general-ledger-codings/:generalLedgerCodingId")
  .get(GeneralLedgerCodingsController.show)
  .patch(GeneralLedgerCodingsController.update)
  .delete(GeneralLedgerCodingsController.destroy)

router
  .route("/api/travel-authorization-action-logs")
  .get(TravelAuthorizationActionLogsController.index)

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
