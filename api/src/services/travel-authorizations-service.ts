import { isNil, isEmpty, isNull } from "lodash"
import { v4 as uuid } from "uuid"

import { TravelAuthorization, User } from "@/models"
import StopsService from "./stops-service"
import LegacyFormSerivce from "./form-service"
import ExpensesService from "./expenses-service"

import db from "@/db/db-client"

export class TravelAuthorizationsService {
  static async create(
    { stops = [], expenses, estimates, ...attributes }: TravelAuthorization,
    currentUser: User
  ): Promise<TravelAuthorization> {
    attributes.userId = currentUser.id
    // Not sure if this is correct, but I can't find anything that generates the formId elsewhere
    if (isNil(attributes.slug)) {
      attributes.slug = uuid()
    }

    return db.transaction(async () => {
      const travelAuthorization = await TravelAuthorization.create(attributes).catch((error) => {
        throw new Error(`Could not create TravelAuthorization: ${error}`)
      })

      const travelAuthorizationId = travelAuthorization.id
      if (!isEmpty(stops)) {
        await StopsService.bulkCreate(travelAuthorizationId, stops)
      }

      const instance = new LegacyFormSerivce()
      await instance.saveExpenses(travelAuthorizationId, expenses)
      await instance.saveEstimates(travelAuthorizationId, estimates)

      return travelAuthorization
    })
  }

  static async update(
    travelAuthorization: TravelAuthorization,
    { stops = [], expenses = [], ...attributes }: Partial<TravelAuthorization>
  ): Promise<TravelAuthorization> {
    await travelAuthorization.update(attributes).catch((error) => {
      throw new Error(`Could not update TravelAuthorization: ${error}`)
    })

    // OPINION: It's not worth supporting layered transactions here,
    // though that would be the standard way of doing things.
    // If we are using an ORM such as Sequelize, it would then be worth doing.
    const travelAuthorizationId = travelAuthorization.id
    if (!isEmpty(stops)) {
      await StopsService.bulkReplace(travelAuthorizationId, stops)
    }

    if (!isEmpty(expenses)) {
      await ExpensesService.bulkReplace(travelAuthorizationId, expenses)
    }

    return travelAuthorization.reload({ include: ["expenses", "stops", "purpose"] })
  }
}

export default TravelAuthorizationsService
