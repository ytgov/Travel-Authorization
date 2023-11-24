import { CreationAttributes } from "sequelize"
import { isEmpty } from "lodash"
import { v4 as uuid } from "uuid"

import db from "@/db/db-client"

import BaseService from "@/services/base-service"
import { StopsService, ExpensesService } from "@/services"
import { AuditService } from "@/services/audit-service"
import { Expense, Stop, TravelAuthorization, TravelAuthorizationActionLog, User } from "@/models"

type StopsCreationAttributes = CreationAttributes<Stop>[]
type TravelAuthorizationCreationAttributes = Omit<
  CreationAttributes<TravelAuthorization>,
  "slug"
> & {
  slug?: TravelAuthorization["slug"]
} & {
  stopsAttributes?: StopsCreationAttributes
  expensesAttributes?: CreationAttributes<Expense>[]
}

// TODO: upgrade this to the enhanced service pattern.
const auditService = new AuditService()

export class CreateService extends BaseService {
  private stopsAttributes: StopsCreationAttributes
  private expensesAttributes: CreationAttributes<Expense>[]
  private attributes: TravelAuthorizationCreationAttributes
  private currentUser: User

  constructor(
    {
      stopsAttributes = [],
      expensesAttributes = [],
      ...attributes
    }: TravelAuthorizationCreationAttributes,
    currentUser: User
  ) {
    super()
    this.attributes = attributes
    this.stopsAttributes = stopsAttributes
    this.expensesAttributes = expensesAttributes
    this.currentUser = currentUser
  }

  async perform(): Promise<TravelAuthorization> {
    const secureAttributes = {
      ...this.attributes,
      status: TravelAuthorization.Statuses.DRAFT,
      slug: this.attributes.slug || uuid(),
      createdBy: this.currentUser.id,
    }

    return db
      .transaction(async () => {
        const travelAuthorization = await TravelAuthorization.create(secureAttributes).catch(
          (error) => {
            throw new Error(`Could not create TravelAuthorization: ${error}`)
          }
        )

        const travelAuthorizationId = travelAuthorization.id
        await this.createStops(travelAuthorizationId, this.stopsAttributes)

        if (!isEmpty(this.expensesAttributes)) {
          await ExpensesService.bulkCreate(travelAuthorizationId, this.expensesAttributes)
        }

        auditService.log(
          this.currentUser.id,
          travelAuthorization.id,
          "Submit",
          "TravelAuthorization submitted successfully."
        )

        return travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
      })
      .catch((error) => {
        auditService.log(
          this.currentUser.id,
          -1,
          "Submit",
          "TravelAuthorization did not submit successfully."
        )
        throw error
      })
  }

  async createStops(travelAuthorizationId: number, stopsAttributes: StopsCreationAttributes) {
    const minimalStopsAttributes = this.ensureMinimalStopsAttributes(stopsAttributes)

    minimalStopsAttributes.forEach((stopAttributes) => {
      stopAttributes.travelAuthorizationId = travelAuthorizationId
    })

    return StopsService.bulkCreate(travelAuthorizationId, minimalStopsAttributes)
  }

  ensureMinimalStopsAttributes(stopsAttributes: StopsCreationAttributes) {
    while (stopsAttributes.length < 2) {
      stopsAttributes.push({})
    }

    return stopsAttributes
  }
}

export default CreateService
