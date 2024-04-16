import { WhereOptions } from "sequelize"
import { isEmpty, isNil } from "lodash"

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
    return this.response.status(200).json({
      travelAuthorizationPreApprovalProfiles,
      totalCount,
    })
  }

  async show() {
    const preApprovalProfile = await this.loadPreApprovalProfile()

    if (isNil(preApprovalProfile)) {
      this.response.status(404).json({
        message: "Travel Authorization Pre-Approval Profile not found",
      })
    }

    return this.response.status(200).json({
      travelAuthorizationPreApprovalProfile: preApprovalProfile,
    })
  }

  async loadPreApprovalProfile() {
    return TravelAuthorizationPreApprovalProfile.findByPk(this.params.id, {
      include: ["preApproval"],
    })
  }
}

export default TravelAuthorizationPreApprovalProfilesController
