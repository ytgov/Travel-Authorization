import { WhereOptions } from "sequelize"
import { isNil } from "lodash"

import { TravelDeskTravelRequest } from "@/models"

import BaseController from "@/controllers/base-controller"

export class TravelDeskTravelRequestsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelDeskTravelRequest>

    // TODO: add policy scope

    try {
      const totalCount = await TravelDeskTravelRequest.count({ where })
      const travelDeskTravelRequests = await TravelDeskTravelRequest.findAll({
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

    // TODO: add policy check

    return this.response.status(200).json({ travelDeskTravelRequest })
  }

  private async loadTravelDeskTravelRequest(): Promise<TravelDeskTravelRequest | null> {
    const { travelDeskTravelRequestId } = this.params
    return TravelDeskTravelRequest.findByPk(travelDeskTravelRequestId)
  }
}

export default TravelDeskTravelRequestsController
