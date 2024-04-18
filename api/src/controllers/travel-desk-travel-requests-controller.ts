import { WhereOptions } from "sequelize"
import { isNil } from "lodash"

import { TravelDeskTravelRequest } from "@/models"
import { TravelDeskTravelRequestsPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class TravelDeskTravelRequestsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelDeskTravelRequest>

    const scopedTravelDeskTravelRequests = TravelDeskTravelRequestsPolicy.applyScope(
      TravelDeskTravelRequest,
      this.currentUser
    )

    try {
      const totalCount = await scopedTravelDeskTravelRequests.count({ where })
      const travelDeskTravelRequests = await scopedTravelDeskTravelRequests.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      return this.response.status(200).json({
        travelDeskTravelRequests,
        totalCount,
      })
    } catch (error) {
      return this.response
        .status(500)
        .json({ message: `Failed to retrieve travel desk requests: ${error}` })
    }
  }

  async show() {
    const travelDeskTravelRequest = await this.loadTravelDeskTravelRequest()
    if (isNil(travelDeskTravelRequest)) {
      return this.response.status(404).json({ message: "Travel desk request not found." })
    }

    const policy = this.buildPolicy(travelDeskTravelRequest)
    if (!policy.show()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this travel desk request." })
    }

    return this.response.status(200).json({ travelDeskTravelRequest })
  }

  private async loadTravelDeskTravelRequest(): Promise<TravelDeskTravelRequest | null> {
    const { travelDeskTravelRequestId } = this.params
    return TravelDeskTravelRequest.findByPk(travelDeskTravelRequestId, {
      include: ["travelAuthorization"],
    })
  }

  private buildPolicy(
    travelDeskTravelRequest: TravelDeskTravelRequest
  ): TravelDeskTravelRequestsPolicy {
    return new TravelDeskTravelRequestsPolicy(this.currentUser, travelDeskTravelRequest)
  }
}

export default TravelDeskTravelRequestsController
