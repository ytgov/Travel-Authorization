import { isNil } from "lodash"
import { WhereOptions } from "sequelize"

import BaseController from "@/controllers/base-controller"

import { GeneralLedgerCoding, TravelAuthorization } from "@/models"
import { GeneralLedgerCodingsPolicy } from "@/policies"
import { GeneralLedgerCodingsSerializer } from "@/serializers"
import { CreateService, UpdateService, DestroyService } from "@/services/general-ledger-codings"

export class GeneralLedgerCodingsController extends BaseController {
  async index() {
    const where = this.query.where as WhereOptions<GeneralLedgerCoding>
    return GeneralLedgerCoding.findAll({
      where,
    }).then((generalLedgerCodings) => {
      const serializedGeneralLedgerCodings =
        GeneralLedgerCodingsSerializer.asTable(generalLedgerCodings)
      return this.response.json({ generalLedgerCodings: serializedGeneralLedgerCodings })
    })
  }

  async create() {
    const generalLedgerCoding = await this.buildGeneralLedgerCoding()
    const policy = this.buildPolicy(generalLedgerCoding)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this general ledger coding." })
    }

    const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
    return CreateService.perform(permittedAttributes, this.currentUser)
      .then((generalLedgerCoding) => {
        return this.response.status(201).json({ generalLedgerCoding })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `General ledger coding creation failed: ${error}` })
      })
  }

  async update() {
    const generalLedgerCoding = await this.loadGeneralLedgerCoding()
    if (isNil(generalLedgerCoding))
      return this.response.status(404).json({ message: "General ledger coding not found." })

    const policy = this.buildPolicy(generalLedgerCoding)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this general ledger coding." })
    }

    const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
    return UpdateService.perform(generalLedgerCoding, permittedAttributes, this.currentUser)
      .then((generalLedgerCoding) => {
        return this.response.json({ generalLedgerCoding })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `General ledger coding update failed: ${error}` })
      })
  }

  async destroy() {
    const generalLedgerCoding = await this.loadGeneralLedgerCoding()
    if (isNil(generalLedgerCoding))
      return this.response.status(404).json({ message: "GeneralLedgerCoding not found." })

    const policy = this.buildPolicy(generalLedgerCoding)
    if (!policy.destroy()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to delete this generalLedgerCoding." })
    }

    return DestroyService.perform(generalLedgerCoding, this.currentUser)
      .then(() => {
        return this.response.status(204).end()
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `GeneralLedgerCoding deletion failed: ${error}` })
      })
  }

  private async buildGeneralLedgerCoding() {
    const attributes = this.request.body
    const generalLedgerCoding = GeneralLedgerCoding.build(attributes)

    const { travelAuthorizationId } = attributes
    const travelAuthorization = await this.loadTravelAuthorization(travelAuthorizationId)
    if (!isNil(travelAuthorization)) {
      generalLedgerCoding.travelAuthorization = travelAuthorization
    }

    return generalLedgerCoding
  }

  private loadTravelAuthorization(
    travelAuthorizationId: number
  ): Promise<TravelAuthorization | null> {
    return TravelAuthorization.findByPk(travelAuthorizationId)
  }

  private loadGeneralLedgerCoding(): Promise<GeneralLedgerCoding | null> {
    return GeneralLedgerCoding.findByPk(this.params.generalLedgerCodingId)
  }

  private buildPolicy(record: GeneralLedgerCoding): GeneralLedgerCodingsPolicy {
    return new GeneralLedgerCodingsPolicy(this.currentUser, record)
  }
}

export default GeneralLedgerCodingsController
