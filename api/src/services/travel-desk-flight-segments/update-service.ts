import { TravelDeskFlightSegment, User } from "@/models"
import BaseService from "@/services/base-service"

export class UpdateService extends BaseService {
  constructor(
    private travelDeskFlightSegment: TravelDeskFlightSegment,
    private attributes: Partial<TravelDeskFlightSegment>,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskFlightSegment> {
    return this.travelDeskFlightSegment.update(this.attributes)
  }
}

export default UpdateService
