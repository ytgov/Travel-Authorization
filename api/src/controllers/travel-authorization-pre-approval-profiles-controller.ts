import { WhereOptions } from "sequelize"
import { isEmpty } from "lodash"

import { TravelAuthorizationPreApprovalProfile } from "@/models"
import { TravelAuthorizationPreApprovalProfilesPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalProfilesController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorizationPreApprovalProfile>
    const filters = this.query.filters as Record<string, unknown>

    const scopedPreApprovalProfiles = TravelAuthorizationPreApprovalProfilesPolicy.applyScope(
      TravelAuthorizationPreApprovalProfile,
      this.currentUser
    )

    let filteredPreApprovalProfiles = scopedPreApprovalProfiles
    if (!isEmpty(filters)) {
      Object.entries(filters).forEach(([key, value]) => {
        filteredPreApprovalProfiles = filteredPreApprovalProfiles.scope({ method: [key, value] })
      })
    }

    const totalCount = await filteredPreApprovalProfiles.count({ where })
    const travelAuthorizationPreApprovalProfiles = await filteredPreApprovalProfiles.findAll({
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
