import { TravelDeskOtherTransportation, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskOtherTransportation>

export class UpdateService extends BaseService {
  constructor(
    protected travelDeskOtherTransportation: TravelDeskOtherTransportation,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskOtherTransportation> {
    return this.travelDeskOtherTransportation.update(this.attributes)
  }
}

export default UpdateService
