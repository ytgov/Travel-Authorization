import db from "@/db/db-client"
import BaseService from "@/services/base-service"

import { TravelAuthorization, TravelAuthorizationActionLog, User } from "@/models"

export class DestroyService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private currentUser: User

  constructor(travelAuthorization: TravelAuthorization, currentUser: User) {
    super()
    this.travelAuthorization = travelAuthorization
    this.currentUser = currentUser
  }

  async perform(): Promise<void> {
    return db.transaction(async () => {
      await this.travelAuthorization.destroy().catch((error) => {
        throw new Error(`Could not delete TravelAuthorization: ${error}`)
      })

      await TravelAuthorizationActionLog.create({
        travelAuthorizationId: this.travelAuthorization.id,
        userId: this.currentUser.id,
        action: TravelAuthorizationActionLog.Actions.DELETE,
      })

      return
    })
  }
}

export default DestroyService
