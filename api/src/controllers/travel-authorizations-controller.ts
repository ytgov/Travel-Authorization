import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { TravelAuthorizationsService } from "@/services"
import { TravelAuthorization } from "@/models"
import { TravelAuthorizationsSerializer } from "@/serializers"
import { TravelAuthorizationsPolicy } from "@/policies"

export class TravelAuthorizationsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<TravelAuthorization>
    const totalCount = await TravelAuthorization.count({ where })
    return TravelAuthorization.findAll({
      where,
      include: [
        {
          association: "stops",
          include: ["location"],
        },
        "expenses",
        "purpose",
        "travelDeskTravelRequest",
        "user",
      ],
      order: [
        ["updatedAt", "ASC"],
        ["stops", "departureDate", "ASC"],
        ["stops", "departureTime", "ASC"],
      ],
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    }).then((travelAuthorizations) => {
      const scopedTravelAuthorizations = TravelAuthorizationsPolicy.scope(
        travelAuthorizations,
        this.currentUser
      )
      const serializedTravelAuthorizations = TravelAuthorizationsSerializer.asTable(
        scopedTravelAuthorizations
      )
      return this.response.json({
        travelAuthorizations: serializedTravelAuthorizations,
        totalCount,
      })
    })
  }

  create() {
    const travelAuthorization = this.buildTravelAuthorization()
    const policy = this.buildPolicy(travelAuthorization)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this travel authorization." })
    }

    const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
    return TravelAuthorizationsService.create(permittedAttributes, this.currentUser)
      .then((travelAuthorization) => {
        const serializedTravelAuthorization =
          TravelAuthorizationsSerializer.asDetailed(travelAuthorization)
        return this.response
          .status(201)
          .json({ travelAuthorization: serializedTravelAuthorization })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `TravelAuthorization submission failed: ${error}` })
      })
  }

  async show() {
    // TODO: make missing route params auto-404?
    if (isNil(this.params.travelAuthorizationId)) {
      return this.response.status(404).json({ message: "TravelAuthorization not found." })
    }

    const travelAuthorization = await this.loadTravelAuthorization()
    if (isNil(travelAuthorization))
      return this.response.status(404).json({ message: "TravelAuthorization not found." })

    const policy = this.buildPolicy(travelAuthorization)
    if (!policy.show()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this TravelAuthorization." })
    }

    return TravelAuthorization.findByPk(this.params.travelAuthorizationId, {
      include: ["expenses", "stops", "purpose"],
    }).then((travelAuthorization) => {
      if (isNil(travelAuthorization)) {
        return this.response.status(404).json({ message: "TravelAuthorization not found." })
      }

      const serializedTravelAuthorization =
        TravelAuthorizationsSerializer.asDetailed(travelAuthorization)

      return this.response.json({ travelAuthorization: serializedTravelAuthorization })
    })
  }

  async update() {
    // TODO: make missing route params auto-404?
    if (isNil(this.params.travelAuthorizationId)) {
      return this.response.status(404).json({ message: "TravelAuthorization not found." })
    }

    const travelAuthorization = await this.loadTravelAuthorization()
    if (isNil(travelAuthorization))
      return this.response.status(404).json({ message: "TravelAuthorization not found." })

    const policy = this.buildPolicy(travelAuthorization)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this travelAuthorization." })
    }

    const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
    return TravelAuthorizationsService.update(travelAuthorization, permittedAttributes)
      .then((travelAuthorization) => {
        const serializedTravelAuthorization =
          TravelAuthorizationsSerializer.asDetailed(travelAuthorization)

        return this.response.json({ travelAuthorization: serializedTravelAuthorization })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `TravelAuthorization update failed: ${error}` })
      })
  }

  private loadTravelAuthorization(): Promise<TravelAuthorization | null> {
    return TravelAuthorization.findByPk(this.params.travelAuthorizationId)
  }

  private buildTravelAuthorization() {
    const attributes = this.request.body
    const travelAuthorization = TravelAuthorization.build({
      ...attributes,
      userId: this.currentUser.id,
    })
    return travelAuthorization
  }

  private buildPolicy(record: TravelAuthorization): TravelAuthorizationsPolicy {
    return new TravelAuthorizationsPolicy(this.currentUser, record)
  }
}

export default TravelAuthorizationsController
