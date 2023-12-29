import db from "@/db/db-client"

import BaseService from "@/services/base-service"
import { UpdateService } from "@/services/travel-authorizations"

import { TravelAuthorization, TravelAuthorizationActionLog, User } from "@/models"

export class SubmitService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private attributes: Partial<TravelAuthorization>
  private approver: User

  constructor(
    travelAuthorization: TravelAuthorization,
    attributes: Partial<TravelAuthorization>,
    approver: User
  ) {
    super()
    this.travelAuthorization = travelAuthorization
    this.attributes = attributes
    this.approver = approver
  }

  async perform(): Promise<TravelAuthorization> {
    if (this.travelAuthorization.status !== TravelAuthorization.Statuses.DRAFT) {
      throw new Error("Travel authorization must be in draft state to submit.")
    } else {
      await db.transaction(async () => {
        this.travelAuthorization = await UpdateService.perform(
          this.travelAuthorization,
          {
            ...this.attributes,
            status: TravelAuthorization.Statuses.SUBMITTED,
          },
          this.approver
        )
        await TravelAuthorizationActionLog.create({
          travelAuthorizationId: this.travelAuthorization.id,
          actorId: this.approver.id,
          assigneeId: this.travelAuthorization.userId,
          action: TravelAuthorizationActionLog.Actions.SUBMITTED,
        })
      })
    }

    return this.travelAuthorization
  }
}

export default SubmitService
