import BaseController from "./base-controller"

import { TravelPurpose } from "@/models"

export class TravelPurposesController extends BaseController<TravelPurpose> {
  async index() {
    try {
      const where = this.buildWhere()

      const totalCount = await TravelPurpose.count({ where })
      const travelPurposes = await TravelPurpose.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      return this.response.json({
        travelPurposes,
        totalCount,
      })
    } catch (error) {
      return this.response.status(400).json({
        message: `Failed to retrieve travel purposes: ${error}`,
      })
    }
  }
}
