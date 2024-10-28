import db, { TravelDeskTravelRequest, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskTravelRequest>

export class BookService extends BaseService {
  constructor(
    protected travelDeskTravelRequest: TravelDeskTravelRequest,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskTravelRequest> {
    if (this.travelDeskTravelRequest.status !== TravelDeskTravelRequest.Statuses.OPTIONS_RANKED) {
      throw new Error(
        "Travel desk travel request must be in options ranked state to complete booking."
      )
    }

    return db.transaction(async () => {
      await this.travelDeskTravelRequest.update({
        ...this.attributes,
        status: TravelDeskTravelRequest.Statuses.BOOKED,
      })

      return this.travelDeskTravelRequest.reload({
        include: ["travelAuthorization"],
      })
    })
  }
}

export default BookService
