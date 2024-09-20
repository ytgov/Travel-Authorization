import { TravelDeskTravelAgency, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskTravelAgency>

export class UpdateService extends BaseService {
  constructor(
    protected travelDeskTravelAgency: TravelDeskTravelAgency,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskTravelAgency> {
    return this.travelDeskTravelAgency.update(this.attributes)
  }
}

export default UpdateService
