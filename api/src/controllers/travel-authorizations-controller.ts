import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "./base-controller"

import { AuditService, TravelAuthorizationsService } from "@/services"
import { TravelAuthorization } from "@/models"
import { TravelAuthorizationsSerializer } from "@/serializers"
import { TravelAuthorizationsPolicy } from "@/policies"

// TODO: push this code back into services where it belongs
const auditService = new AuditService()

export class TravelAuthorizationsController extends BaseController {
  index() {
    const where = this.query.where as WhereOptions<TravelAuthorization>
    return TravelAuthorization.findAndCountAll({
      where,
      include: [
        {
          association: "stops",
          include: ["location"],
        },
        "expenses",
        "purpose",
        "travelDeskTravelRequest",
      ],
      order: [
        ["updatedAt", "DESC"],
        ["stops", "departureDate", "ASC"],
        ["stops", "departureTime", "ASC"],
      ],
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    }).then(({ rows: travelAuthorizations, count }) => {
      const scopedTravelAuthorizations = TravelAuthorizationsPolicy.scope(
        travelAuthorizations,
        this.currentUser
      )
      const serializedTravelAuthorizations = TravelAuthorizationsSerializer.asTable(
        scopedTravelAuthorizations
      )
      return this.response.json({
        travelAuthorizations: serializedTravelAuthorizations,
        totalCount: count,
      })
    })
  }

  create() {
    return TravelAuthorizationsService.create(this.request.body, this.currentUser)
      .then((travelAuthorization) => {
        // TODO: push the audit logging code back into services where it belongs
        auditService.log(
          this.currentUser.id,
          travelAuthorization.id,
          "Submit",
          "TravelAuthorization submitted successfully."
        )
        return this.response.status(201).json({ travelAuthorization })
      })
      .catch((error) => {
        // TODO: push the audit logging code back into services where it belongs
        auditService.log(
          this.currentUser.id,
          -1,
          "Submit",
          "TravelAuthorization did not submit successfully."
        )
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

      return this.response.json({ travelAuthorization })
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

    return TravelAuthorizationsService.update(this.params.travelAuthorizationId, this.request.body)
      .then((travelAuthorization) => {
        this.response.json({ travelAuthorization })
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

  private buildPolicy(record: TravelAuthorization): TravelAuthorizationsPolicy {
    return new TravelAuthorizationsPolicy(this.currentUser, record)
  }
}

export default TravelAuthorizationsController
