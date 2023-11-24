import { CreationAttributes } from "sequelize"
import { isEmpty } from "lodash"

import db from "@/db/db-client"
import BaseService from "@/services/base-service"

import { Expense, Stop, TravelAuthorization, TravelAuthorizationActionLog, User } from "@/models"
import { StopsService, ExpensesService } from "@/services"

type StopsCreationAttributes = CreationAttributes<Stop>[]

export class UpdateService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private stops: StopsCreationAttributes
  private expenses: CreationAttributes<Expense>[]
  private attributes: Partial<TravelAuthorization>
  private currentUser: User

  constructor(
    travelAuthorization: TravelAuthorization,
    { stops = [], expenses = [], ...attributes }: Partial<TravelAuthorization>,
    currentUser: User
  ) {
    super()
    this.travelAuthorization = travelAuthorization
    this.attributes = attributes
    this.stops = stops
    this.expenses = expenses
    this.currentUser = currentUser
  }

  async perform(): Promise<TravelAuthorization> {
    if (!this.isValidStopCount(this.attributes, this.stops)) {
      throw new Error("Stop count is not valid for trip type.")
    }

    return db.transaction(async () => {
      await this.travelAuthorization.update(this.attributes).catch((error) => {
        throw new Error(`Could not update TravelAuthorization: ${error}`)
      })

      const travelAuthorizationId = this.travelAuthorization.id
      if (!isEmpty(this.stops)) {
        await StopsService.bulkReplace(travelAuthorizationId, this.stops)
      }

      if (!isEmpty(this.expenses)) {
        await ExpensesService.bulkReplace(travelAuthorizationId, this.expenses)
      }

      await TravelAuthorizationActionLog.create({
        travelAuthorizationId: this.travelAuthorization.id,
        userId: this.currentUser.id,
        action: TravelAuthorizationActionLog.Actions.UPDATE,
      })

      return this.travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
    })
  }

  isValidStopCount(attributes: Partial<TravelAuthorization>, stops: Partial<Stop>[]): Boolean {
    if (attributes.oneWayTrip) {
      return stops.length === 2
    } else if (attributes.multiStop) {
      return stops.length === 4
    } else {
      return stops.length === 2
    }
  }
}

export default UpdateService
