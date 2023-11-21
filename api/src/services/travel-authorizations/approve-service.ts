import BaseService from "@/services/base-service"
import { TravelAuthorization, User } from "@/models"

export class ApproveService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private approver: User

  constructor(travelAuthorization: TravelAuthorization, approver: User) {
    super()
    this.travelAuthorization = travelAuthorization
    this.approver = approver
  }

  async perform(): Promise<TravelAuthorization> {
    if (this.travelAuthorization.status !== TravelAuthorization.Statuses.SUBMITTED) {
      throw new Error("Travel authorization must be in submitted state to approve.")
    } else {
      // TODO: save approver id once that exists in the database
      await this.travelAuthorization.update({ status: TravelAuthorization.Statuses.APPROVED })
    }

    return this.travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
  }
}

export default ApproveService
