import { Router, Request, Response } from "express"

import { checkJwt, loadUser } from "@/middleware/authz.middleware"
import {
  ExpensesController,
  LocationsController,
  PreApprovedTravelersController,
  PreApprovedTravelRequestsController,
  TravelAuthorizationsController,
  forms,
} from "@/controllers"

export * from "./owner-router"
export * from "./users-router"
export * from "./lookup-router"
export * from "./perm-router"
export * from "./manager-router"
export * from "./healthcheck-router"
export * from "./form-router"
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
router.get("/api/expenses", ExpensesController.index)
router.post("/api/expenses", ExpensesController.create)
router.patch("/api/expenses/:expenseId", ExpensesController.update)
router.delete("/api/expenses/:expenseId", ExpensesController.destroy)
router.get("/api/travel-authorizations", TravelAuthorizationsController.index)
router.post("/api/travel-authorizations", TravelAuthorizationsController.create)
router.get("/api/travel-authorizations/:travelAuthorizationId", TravelAuthorizationsController.show)
router.patch("/api/travel-authorizations/:travelAuthorizationId", TravelAuthorizationsController.update)
router.post("/api/forms/:travelAuthorizationId/estimates/generate", forms.estimates.GenerateController.create)
router.get("/api/locations", LocationsController.index)
router.get("/api/pre-approved-travels", PreApprovedTravelersController.index)
router.get("/api/pre-approved-travel-requests", PreApprovedTravelRequestsController.index)

// if no other routes match, return a 404
router.use("/api", (req: Request, res: Response) => {
  return res.status(404).json({ message: "Not Found" })
})

export default router
