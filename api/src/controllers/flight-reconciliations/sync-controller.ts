import logger from "@/utils/logger"
import { FlightReconciliation } from "@/models"
import { FlightReconciliationsPolicy } from "@/policies"
import { SyncService } from "@/services/flight-reconciliations"

import BaseController from "@/controllers/base-controller"

export class SyncController extends BaseController<FlightReconciliation> {
  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to sync flight reconciliations.",
        })
      }

      await SyncService.perform(this.currentUser)
      return this.response.status(201).json({
        message: "Flight reconciliation synced successfully.",
      })
    } catch (error) {
      logger.error(`Error syncing flight reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to sync flight reconciliation: ${error}`,
      })
    }
  }

  private buildPolicy(flightReconciliation: FlightReconciliation = FlightReconciliation.build()) {
    return new FlightReconciliationsPolicy(this.currentUser, flightReconciliation)
  }
}

export default SyncController
