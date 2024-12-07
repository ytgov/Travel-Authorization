import db, { TravelDeskTravelRequest, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskTravelRequest>

export class OptionsProvidedService extends BaseService {
  constructor(
    protected travelDeskTravelRequest: TravelDeskTravelRequest,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskTravelRequest> {
    if (this.travelDeskTravelRequest.status !== TravelDeskTravelRequest.Statuses.SUBMITTED) {
      throw new Error(
        "Travel desk travel request must be in submitted state to provide options."
      )
    }

    return db.transaction(async () => {
      await this.travelDeskTravelRequest.update({
        ...this.attributes,
        status: TravelDeskTravelRequest.Statuses.OPTIONS_PROVIDED,
      })

      return this.travelDeskTravelRequest.reload({
        include: ["travelAuthorization"],
      })
    })
  }
}

export default OptionsProvidedService
