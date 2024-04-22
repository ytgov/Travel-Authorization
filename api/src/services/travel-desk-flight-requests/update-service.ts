import { TravelDeskFlightRequest, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskFlightRequest>

export class UpdateService extends BaseService {
  constructor(
    protected travelDeskFlightRequest: TravelDeskFlightRequest,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskFlightRequest> {
    return this.travelDeskFlightRequest.update(this.attributes)
  }
}

export default UpdateService
