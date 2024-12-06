import { isEmpty } from "lodash"

import db, { User, TravelDeskFlightSegment } from "@/models"
import BaseService from "@/services/base-service"

export type TravelDeskFlightSegmentOrderAttributes = {
  travelDeskFlightSegmentId: number
  oldSortOrder: number
  newSortOrder: number
}[]

export class CreateService extends BaseService {
  constructor(
    private travelDeskFlightOptionId: number,
    private flightSegmentOrderAttributes: TravelDeskFlightSegmentOrderAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    if (isEmpty(this.flightSegmentOrderAttributes)) {
      throw new Error("Flight segment order attributes are required.")
    }

    return db.transaction(async () => {
      for (const { newSortOrder, travelDeskFlightSegmentId } of this.flightSegmentOrderAttributes) {
        await TravelDeskFlightSegment.update(
          {
            sortOrder: newSortOrder,
          },
          {
            where: {
              id: travelDeskFlightSegmentId,
            },
          }
        )
      }
    })
  }
}

export default CreateService
