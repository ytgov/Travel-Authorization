import { WhereOptions } from "sequelize"

import { TravelAuthorizationPreApprovalProfile } from "@/models"

import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalProfilesController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorizationPreApprovalProfile>

    const preApprovedTravelers = await TravelAuthorizationPreApprovalProfile.findAll({
      where,
      include: ["preApproval"],
    })
    return this.response.json({ preApprovedTravelers })
  }
}

export default TravelAuthorizationPreApprovalProfilesController
