import { CreationAttributes } from "sequelize"
import { isNil, isEmpty } from "lodash"
import { v4 as uuid } from "uuid"

import { Expense, Stop, TravelAuthorization, User } from "@/models"
import StopsService from "./stops-service"
import LegacyFormSerivce from "./form-service"
import ExpensesService from "./expenses-service"

import db from "@/db/db-client"
import { AuditService } from "./audit-service"

// TODO: upgrade this to the enhanced service pattern.
const auditService = new AuditService()

type TravelAuthorizationCreationAttributes = Omit<
  CreationAttributes<TravelAuthorization>,
  "slug"
> & {
  slug?: TravelAuthorization["slug"]
} & {
  stops?: CreationAttributes<Stop>[]
  expenses?: CreationAttributes<Expense>[]
  estimates?: CreationAttributes<Expense>[]
}

export class TravelAuthorizationsService {
  static async create(
    { stops = [], expenses, estimates, ...attributes }: TravelAuthorizationCreationAttributes,
    currentUser: User
  ): Promise<TravelAuthorization> {
    const secureAttributes = {
      ...attributes,
      userId: currentUser.id,
      slug: attributes.slug || uuid(),
    }

    return db
      .transaction(async () => {
        const travelAuthorization = await TravelAuthorization.create(secureAttributes).catch(
          (error) => {
            throw new Error(`Could not create TravelAuthorization: ${error}`)
          }
        )

        const travelAuthorizationId = travelAuthorization.id
        if (!isEmpty(stops)) {
          await StopsService.bulkCreate(travelAuthorizationId, stops)
        }

        const instance = new LegacyFormSerivce()
        await instance.saveExpenses(travelAuthorizationId, expenses)
        await instance.saveEstimates(travelAuthorizationId, estimates)

        auditService.log(
          currentUser.id,
          travelAuthorization.id,
          "Submit",
          "TravelAuthorization submitted successfully."
        )

        return travelAuthorization
      })
      .catch((error) => {
        auditService.log(
          currentUser.id,
          -1,
          "Submit",
          "TravelAuthorization did not submit successfully."
        )
        throw error
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
