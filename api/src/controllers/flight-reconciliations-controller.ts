import { isNil } from "lodash"

import logger from "@/utils/logger"
import { FlightReconciliation } from "@/models"
import { FlightReconciliationsPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/flight-reconciliations"

import BaseController from "@/controllers/base-controller"

export class FlightReconciliationsController extends BaseController<FlightReconciliation> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder([["createdAt", "ASC"]])

      const scopedFlightReconciliations = FlightReconciliationsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedFlightReconciliations.count({ where })
      const flightReconciliations = await scopedFlightReconciliations.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        order,
      })
      return this.response.status(200).json({
        flightReconciliations,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching flight reconciliations: ${error}`, { error })
      return this.response.status(400).json({
        message: `Failed to retrieve flight reconciliations: ${error}`,
      })
    }
  }

  async show() {
    try {
      const flightReconciliation = await this.loadFlightReconciliation()
      if (isNil(flightReconciliation)) {
        return this.response.status(404).json({
          message: "Flight reconciliation not found.",
        })
      }

      const policy = this.buildPolicy(flightReconciliation)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this flight reconciliation.",
        })
      }

      return this.response.status(200).json({
        flightReconciliation,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching flight reconciliation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Failed to retrieve flight reconciliation: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create flight reconciliations.",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const flightReconciliation = CreateService.perform(permittedAttributes, this.currentUser)
      return this.response.status(201).json({
        flightReconciliation,
      })
    } catch (error) {
      logger.error(`Error creating flight reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to create flight reconciliation: ${error}`,
      })
    }
  }

  async update() {
    try {
      const flightReconciliation = await this.loadFlightReconciliation()
      if (isNil(flightReconciliation)) {
        return this.response.status(404).json({
          message: "Flight reconciliation not found.",
        })
      }

      const policy = this.buildPolicy(flightReconciliation)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this flight reconciliation.",
        })
      }

      const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
      await UpdateService.perform(flightReconciliation, permittedAttributes, this.currentUser)

      return this.response.status(200).json({
        flightReconciliation,
      })
    } catch (error) {
      logger.error(`Error updating flight reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to update flight reconciliation: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const flightReconciliation = await this.loadFlightReconciliation()
      if (isNil(flightReconciliation)) {
        return this.response.status(404).json({
          message: "Flight reconciliation not found.",
        })
      }

      const policy = this.buildPolicy(flightReconciliation)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this flight reconciliation.",
        })
      }

      await flightReconciliation.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting flight reconciliation: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to delete flight reconciliation: ${error}`,
      })
    }
  }

  private async loadFlightReconciliation() {
    return await FlightReconciliation.findByPk(this.params.flightReconciliationId)
  }

  private buildPolicy(flightReconciliation: FlightReconciliation = FlightReconciliation.build()) {
    return new FlightReconciliationsPolicy(this.currentUser, flightReconciliation)
  }
}

export default FlightReconciliationsController
