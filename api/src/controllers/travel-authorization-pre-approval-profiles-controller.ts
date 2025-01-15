import { isNil } from "lodash"

import logger from "@/utils/logger"
import { TravelAuthorizationPreApprovalProfile } from "@/models"
import { TravelAuthorizationPreApprovalProfilesPolicy } from "@/policies"
import BaseController from "@/controllers/base-controller"

export class TravelAuthorizationPreApprovalProfilesController extends BaseController<TravelAuthorizationPreApprovalProfile> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()

      const scopedPreApprovalProfiles = TravelAuthorizationPreApprovalProfilesPolicy.applyScope(
        scopes,
        this.currentUser
      )

      const totalCount = await scopedPreApprovalProfiles.count({ where })
      const travelAuthorizationPreApprovalProfiles = await scopedPreApprovalProfiles.findAll({
        where,
        include: ["preApproval"],
      })
      return this.response.status(200).json({
        travelAuthorizationPreApprovalProfiles,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching travel authorization pre-approval profiles: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching travel authorization pre-approval profiles: ${error}`,
      })
    }
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
