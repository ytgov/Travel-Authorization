import { WhereOptions } from "sequelize"

import { TravelAuthorizationPreApprovalProfile } from "@/models"
import { TravelAuthorizationPreApprovalProfilesPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalProfilesController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorizationPreApprovalProfile>

    const scopedTravelAuthorizationPreApprovalProfiles =
      TravelAuthorizationPreApprovalProfilesPolicy.applyScope(
        TravelAuthorizationPreApprovalProfile,
        this.currentUser
      )

    const totalCount = await scopedTravelAuthorizationPreApprovalProfiles.count({ where })
    const travelAuthorizationPreApprovalProfiles =
      await scopedTravelAuthorizationPreApprovalProfiles.findAll({
        where,
        include: ["preApproval"],
      })
    return this.response.json({
      travelAuthorizationPreApprovalProfiles,
      totalCount,
    })
  }
}

export default TravelAuthorizationPreApprovalProfilesController
