import { TravelDeskHotel, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskHotel>

export class UpdateService extends BaseService {
  constructor(
    protected travelDeskHotel: TravelDeskHotel,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskHotel> {
    return this.travelDeskHotel.update(this.attributes)
  }
}

export default UpdateService
