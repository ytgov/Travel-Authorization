import db from "@/db/db-client"

import BaseService from "@/services/base-service"
import { TravelAuthorization, TravelAuthorizationActionLog, User } from "@/models"

export class ApproveService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private approver: User

  constructor(travelAuthorization: TravelAuthorization, approver: User) {
    super()
    this.travelAuthorization = travelAuthorization
    this.approver = approver
  }

  async perform(): Promise<TravelAuthorization> {
    if (this.travelAuthorization.status === TravelAuthorization.Statuses.SUBMITTED) {
      await db.transaction(async () => {
        await this.travelAuthorization.update({
          status: TravelAuthorization.Statuses.APPROVED,
        })
        await TravelAuthorizationActionLog.create({
          travelAuthorizationId: this.travelAuthorization.id,
          actorId: this.approver.id,
          assigneeId: this.travelAuthorization.userId,
          action: TravelAuthorizationActionLog.Actions.APPROVED,
        })
      })
    } else if (this.travelAuthorization.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_SUBMITTED) {
      await db.transaction(async () => {
        await this.travelAuthorization.update({
          status: TravelAuthorization.Statuses.EXPENSE_CLAIM_APPROVED,
        })
        await TravelAuthorizationActionLog.create({
          travelAuthorizationId: this.travelAuthorization.id,
          actorId: this.approver.id,
          assigneeId: this.travelAuthorization.userId,
          action: TravelAuthorizationActionLog.Actions.EXPENSE_CLAIM_APPROVED,
        })
      })
    } else {
      throw new Error("Travel authorization must be in submitted or expense claim submitted state to approve.")
    }

    return this.travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
  }
}

export default ApproveService
