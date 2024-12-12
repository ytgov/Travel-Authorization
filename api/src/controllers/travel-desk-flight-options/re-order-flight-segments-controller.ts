import { isNil } from "lodash"

import logger from "@/utils/logger"
import { TravelDeskFlightOption } from "@/models"
import { TravelDeskFlightOptionsPolicy } from "@/policies"
import { ReOrderFlightSegments } from "@/services/travel-desk-flight-options"
import BaseController from "@/controllers/base-controller"

export class ReOrderFlightSegmentsController extends BaseController<TravelDeskFlightOption> {
  async create() {
    try {
      const travelDeskFlightOption = await this.loadTravelDeskFlightOption()
      if (isNil(travelDeskFlightOption)) {
        return this.response.status(404).json({
          message: "TravelDeskFlightOption not found",
        })
      }

      const policy = this.buildTravelDeskFlightOptionPolicy(travelDeskFlightOption)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to re-order travel desk flight option flight segments.",
        })
      }

      await ReOrderFlightSegments.CreateService.perform(
        travelDeskFlightOption.id,
        this.request.body,
        this.currentUser
      )
      return this.response.json({
        message: "TravelDeskFlightOption flight segments succesfully re-ordered",
      })
    } catch (error) {
      logger.error("Error re-ordering travel desk flight option flight segments: " + error)
      return this.response.status(422).json({
        message: `Error re-ordering travel desk flight option flight segments: ${error}`,
      })
    }
  }

  private async loadTravelDeskFlightOption(): Promise<TravelDeskFlightOption | null> {
    const travelDeskFlightOption = await TravelDeskFlightOption.findByPk(
      this.params.travelDeskFlightOptionId
    )
    if (isNil(travelDeskFlightOption)) return null

    return travelDeskFlightOption
  }

  private buildTravelDeskFlightOptionPolicy(travelDeskFlightOption: TravelDeskFlightOption) {
    return new TravelDeskFlightOptionsPolicy(this.currentUser, travelDeskFlightOption)
  }
}

export default ReOrderFlightSegmentsController
