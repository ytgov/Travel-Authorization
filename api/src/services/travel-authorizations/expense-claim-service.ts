import { isEmpty, isNil } from "lodash"

import db from "@/db/db-client"

import BaseService from "@/services/base-service"
import { TravelAuthorization, TravelAuthorizationActionLog, User } from "@/models"

export class ExpenseClaimService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private supervisorEmail: string
  private currentUser: User

  constructor(
    travelAuthorization: TravelAuthorization,
    supervisorEmail: string,
    currentUser: User
  ) {
    super()
    this.travelAuthorization = travelAuthorization
    this.supervisorEmail = supervisorEmail
    this.currentUser = currentUser
  }

  async perform(): Promise<TravelAuthorization> {
    if (this.travelAuthorization.status !== TravelAuthorization.Statuses.APPROVED) {
      throw new Error(
        "Travel authorization must be in an approved state to submit an expense claim."
      )
    }
    if (isNil(this.supervisorEmail) || isEmpty(this.supervisorEmail)) {
      throw new Error("Supervisor email is required to submit and expense claim.")
    }

    await db.transaction(async () => {
      await this.travelAuthorization.update({
        supervisorEmail: this.supervisorEmail,
        status: TravelAuthorization.Statuses.EXPENSE_CLAIM,
      })
      await TravelAuthorizationActionLog.create({
        travelAuthorizationId: this.travelAuthorization.id,
        userId: this.currentUser.id,
        action: TravelAuthorizationActionLog.Actions.EXPENSE_CLAIM,
      })
    })

    return this.travelAuthorization.reload({
      include: ["expenses", "stops", "purpose", "user", "travelSegments"],
    })
  }
}

export default ExpenseClaimService
