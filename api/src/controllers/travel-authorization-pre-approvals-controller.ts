import { WhereOptions } from "sequelize"

import { TravelAuthorizationPreApproval } from "@/models"
import { TravelAuthorizationPreApprovalsPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorizationPreApproval>

    const scopedTravelAuthorizationPreApprovals = TravelAuthorizationPreApprovalsPolicy.applyScope(
      TravelAuthorizationPreApproval,
      this.currentUser
    )

    const totalCount = await scopedTravelAuthorizationPreApprovals.count({ where })
    const travelAuthorizationPreApprovals = await scopedTravelAuthorizationPreApprovals.findAll({
      where,
      include: ["profiles"],
    })
    return this.response.json({
      travelAuthorizationPreApprovals,
      totalCount,
    })
  }
}

export default TravelAuthorizationPreApprovalsController
