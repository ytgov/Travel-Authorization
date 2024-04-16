import { WhereOptions } from "sequelize"

import { TravelAuthorizationPreApprovalTraveler } from "@/models"

import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalTravelersController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorizationPreApprovalTraveler>

    const preApprovedTravelers = await TravelAuthorizationPreApprovalTraveler.findAll({
      where,
      include: ["preApprovedRequest"],
    })
    return this.response.json({ preApprovedTravelers })
  }
}

export default TravelAuthorizationPreApprovalTravelersController
