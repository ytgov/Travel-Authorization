import BaseService from "@/services/base-service"
import { TravelAuthorization, User } from "@/models"

export class DenyService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private denier: User

  constructor(travelAuthorization: TravelAuthorization, denier: User) {
    super()
    this.travelAuthorization = travelAuthorization
    this.denier = denier
  }

  async perform(): Promise<TravelAuthorization> {
    if (this.travelAuthorization.status !== TravelAuthorization.Statuses.SUBMITTED) {
      throw new Error("Travel authorization must be in submitted state to deny.")
    } else {
      await this.travelAuthorization.update({
        // TODO: add this in once data modeling exists
        // deniedByUserId: this.denier.id,
        // TODO: add support for denial reason
        // denialReason: "???",
        status: TravelAuthorization.Statuses.DENIED,
      })
    }

    return this.travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
  }
}

export default DenyService
