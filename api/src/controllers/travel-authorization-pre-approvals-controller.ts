import BaseController from "./base-controller"

import { Preapproved } from "@/models"

export class TravelAuthorizationPreApprovalsController extends BaseController {
  async index() {
    const where = this.query.where
    const travelAuthorizationPreApprovals = await Preapproved.findAll({
      where,
      include: ["preApprovedTravelers"],
    })
    return this.response.json({
      travelAuthorizationPreApprovals,
    })
  }
}

export default TravelAuthorizationPreApprovalsController
