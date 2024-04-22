import { WhereOptions } from "sequelize"

import { TravelDeskFlightRequest } from "@/models"
import { TravelDeskFlightRequestsPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class TravelDeskFlightRequestsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelDeskFlightRequest>

    const scopedTravelDeskFlightRequests = TravelDeskFlightRequestsPolicy.applyScope(
      TravelDeskFlightRequest,
      this.currentUser
    )

    try {
      const totalCount = await scopedTravelDeskFlightRequests.count({ where })
      const travelDeskFlightRequests = await scopedTravelDeskFlightRequests.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      return this.response.status(200).json({
        travelDeskFlightRequests,
        totalCount,
      })
    } catch (error) {
      return this.response
        .status(500)
        .json({ message: `Failed to retrieve travel desk flight requests: ${error}` })
    }
  }
}

export default TravelDeskFlightRequestsController
