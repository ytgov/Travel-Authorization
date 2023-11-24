import { isEmpty } from "lodash"

import { TravelAuthorization } from "@/models"
import StopsService from "./stops-service"
import ExpensesService from "./expenses-service"

// TODO: move this to a travel-authorizations/update-service.ts
export class TravelAuthorizationsService {
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

    return travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
  }
}

export default TravelAuthorizationsService
