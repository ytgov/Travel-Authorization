import { WhereOptions } from "sequelize"

import { TravelAuthorizationPreApproval } from "@/models"

import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorizationPreApproval>
    const travelAuthorizationPreApprovals = await TravelAuthorizationPreApproval.findAll({
      where,
      include: ["travelers"],
    })
    return this.response.json({
      travelAuthorizationPreApprovals,
    })
  }
}

export default TravelAuthorizationPreApprovalsController
