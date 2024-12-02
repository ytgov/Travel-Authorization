import { TravelDeskFlightOption, User } from "@/models"
import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskFlightOption>

export class UpdateService extends BaseService {
  constructor(
    protected flightOption: TravelDeskFlightOption,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskFlightOption> {
    return this.flightOption.update(this.attributes)
  }
}

export default UpdateService
