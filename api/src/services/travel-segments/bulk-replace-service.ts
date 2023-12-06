import { CreationAttributes } from "sequelize"

import db from "@/db/db-client"
import BaseService from "@/services/base-service"

import { TravelSegment } from "@/models"

export class BulkReplaceService extends BaseService {
  private travelAuthorizationId: number
  private travelSegmentsAttributes: CreationAttributes<TravelSegment>[]

  constructor(
    travelAuthorizationId: number,
    travelSegmentsAttributes: CreationAttributes<TravelSegment>[]
  ) {
    super()
    this.travelAuthorizationId = travelAuthorizationId
    this.travelSegmentsAttributes = travelSegmentsAttributes
  }

  async perform(): Promise<TravelSegment[]> {
    if (
      !this.travelSegmentsAttributes.every(
        (travelSegmentAttributes) =>
          travelSegmentAttributes.travelAuthorizationId === this.travelAuthorizationId
      )
    ) {
      throw new Error("All travelSegments must belong to the same form.")
    }

    return db.transaction(async () => {
      await TravelSegment.destroy({ where: { travelAuthorizationId: this.travelAuthorizationId } })
      return TravelSegment.bulkCreate(this.travelSegmentsAttributes)
    })
  }
}

export default BulkReplaceService
