import { CreationAttributes } from "sequelize"
import { isEmpty } from "lodash"
import { v4 as uuid } from "uuid"

import db from "@/db/db-client"

import BaseService from "@/services/base-service"
import { Stops, StopsService, ExpensesService } from "@/services"
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
        await this.createStops(travelAuthorization, this.stopsAttributes)
        // TODO: remove this once travel segments fully replace stops
        await Stops.BulkConvertStopsToTravelSegmentsService.perform(travelAuthorization)

        if (!isEmpty(this.expensesAttributes)) {
          await ExpensesService.bulkCreate(travelAuthorizationId, this.expensesAttributes)
        }

        auditService.log(
          this.currentUser.id,
          travelAuthorization.id,
          "Submit",
          "TravelAuthorization submitted successfully."
        )

        return travelAuthorization.reload({
          include: ["expenses", "stops", "purpose", "user", "travelSegments"],
        })
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

  async createStops(
    travelAuthorization: TravelAuthorization,
    stopsAttributes: StopsCreationAttributes
  ) {
    const minimalStopsAttributesWithDefaults = this.ensureMinimalDefaultStopsAttributes(
      travelAuthorization,
      stopsAttributes
    )

    return StopsService.bulkCreate(travelAuthorization.id, minimalStopsAttributesWithDefaults)
  }

  // TODO: might want to make this a validator against updates as well?
  ensureMinimalDefaultStopsAttributes(
    travelAuthorization: TravelAuthorization,
    stopsAttributes: StopsCreationAttributes
  ): StopsCreationAttributes {
    if (travelAuthorization.multiStop) {
      return this.ensureMinimalDefaultMultiDestinationStopsAttributes(
        travelAuthorization.id,
        stopsAttributes
      )
    } else if (travelAuthorization.oneWayTrip) {
      return this.ensureMinimalDefaultOneWayStopsAttributes(travelAuthorization.id, stopsAttributes)
    } else {
      return this.ensureMinimalDefaultRoundTripStopsAttributes(
        travelAuthorization.id,
        stopsAttributes
      )
    }
  }

  ensureMinimalDefaultMultiDestinationStopsAttributes(
    travelAuthorizationId: number,
    stopsAttributes: StopsCreationAttributes
  ): StopsCreationAttributes {
    return [
      {
        travelAuthorizationId,
        accommodationType: Stop.AccommodationTypes.HOTEL,
        transport: Stop.TravelMethods.AIRCRAFT,
        ...stopsAttributes[0],
      },
      {
        travelAuthorizationId,
        accommodationType: Stop.AccommodationTypes.HOTEL,
        transport: Stop.TravelMethods.AIRCRAFT,
        ...stopsAttributes[1],
      },
      {
        travelAuthorizationId,
        accommodationType: null,
        transport: Stop.TravelMethods.AIRCRAFT,
        ...stopsAttributes[2],
      },
      {
        travelAuthorizationId,
        transport: null,
        accommodationType: null,
        ...stopsAttributes[3],
      },
    ]
  }

  ensureMinimalDefaultOneWayStopsAttributes(
    travelAuthorizationId: number,
    stopsAttributes: StopsCreationAttributes
  ): StopsCreationAttributes {
    return [
      {
        travelAuthorizationId,
        accommodationType: null,
        transport: Stop.TravelMethods.AIRCRAFT,
        ...stopsAttributes[0],
      },
      {
        travelAuthorizationId,
        accommodationType: null,
        transport: null,
        ...stopsAttributes[1],
      },
    ]
  }

  ensureMinimalDefaultRoundTripStopsAttributes(
    travelAuthorizationId: number,
    stopsAttributes: StopsCreationAttributes
  ): StopsCreationAttributes {
    return [
      {
        travelAuthorizationId,
        accommodationType: Stop.AccommodationTypes.HOTEL,
        transport: Stop.TravelMethods.AIRCRAFT,
        ...stopsAttributes[0],
      },
      {
        travelAuthorizationId,
        accommodationType: null,
        transport: Stop.TravelMethods.AIRCRAFT,
        ...stopsAttributes[1],
      },
    ]
  }
}

export default CreateService
