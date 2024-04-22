import { WhereOptions } from "sequelize"
import { isNil } from "lodash"

import { TravelDeskFlightRequest, TravelDeskTravelRequest } from "@/models"
import { TravelDeskFlightRequestsPolicy } from "@/policies"
import { CreateService, UpdateService } from "@/services/travel-desk-flight-requests"

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

  async create() {
    try {
      const travelDeskFlightRequest = await this.buildTravelDeskFlightRequest()
      const policy = this.buildPolicy(travelDeskFlightRequest)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this flight request." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newTravelDeskFlightRequest = await CreateService.perform(
        permittedAttributes,
        this.currentUser
      )
      return this.response.status(201).json({ travelDeskFlightRequest: newTravelDeskFlightRequest })
    } catch (error) {
      return this.response.status(422).json({ message: `Flight request creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const travelDeskFlightRequest = await this.loadTravelDeskFlightRequest()
      if (isNil(travelDeskFlightRequest)) {
        return this.response.status(404).json({ message: "Flight request not found." })
      }

      const policy = this.buildPolicy(travelDeskFlightRequest)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this flight request." })
      }

      const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
      const updatedTravelDeskFlightRequest = await UpdateService.perform(
        travelDeskFlightRequest,
        permittedAttributes,
        this.currentUser
      )
      return this.response
        .status(200)
        .json({ travelDeskFlightRequest: updatedTravelDeskFlightRequest })
    } catch (error) {
      return this.response.status(422).json({ message: `Flight request update failed: ${error}` })
    }
  }

  private async buildTravelDeskFlightRequest(): Promise<TravelDeskFlightRequest> {
    const travelDeskFlightRequest = TravelDeskFlightRequest.build(this.request.body)

    const { travelRequestId } = travelDeskFlightRequest
    const travelDeskTravelRequest = await TravelDeskTravelRequest.findByPk(travelRequestId)
    if (isNil(travelDeskTravelRequest)) {
      throw new Error(`Travel request not found for travelRequestId=${travelRequestId}`)
    }

    travelDeskFlightRequest.travelRequest = travelDeskTravelRequest

    return travelDeskFlightRequest
  }

  private loadTravelDeskFlightRequest(): Promise<TravelDeskFlightRequest | null> {
    return TravelDeskFlightRequest.findByPk(this.params.travelDeskFlightRequestId, {
      include: [
        // required for policy check
        {
          association: "travelRequest",
          include: ["travelAuthorization"],
        },
      ],
    })
  }

  private buildPolicy(travelDeskFlightRequest: TravelDeskFlightRequest) {
    return new TravelDeskFlightRequestsPolicy(this.currentUser, travelDeskFlightRequest)
  }
}

export default TravelDeskFlightRequestsController
