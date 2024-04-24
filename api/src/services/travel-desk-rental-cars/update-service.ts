import { TravelDeskRentalCar, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskRentalCar>

export class UpdateService extends BaseService {
  constructor(
    protected travelDeskRentalCar: TravelDeskRentalCar,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskRentalCar> {
    return this.travelDeskRentalCar.update(this.attributes)
  }
}

export default UpdateService
