import { chunk, isNil } from "lodash"

import db from "../../db/db-client-legacy"

import { Destination, Expense, ExpenseTypes, Types as ExpenseVariants, Stop } from "../../models"
import BaseService from "../base-service"

// Keep in sync with src/web/src/modules/travelForm/components/TravelMethodSelect.vue
// Until both are using a shared location
const TRAVEL_METHODS = Object.freeze({
  AIRCRAFT: "Aircraft",
  POOL_VEHICLE: "Pool Vehicle",
  PERSONAL_VEHICLE: "Personal Vehicle",
  RENTAL_VEHICLE: "Rental Vehicle",
  BUS: "Bus",
  OTHER: "Other:",
})

export class BulkGenerate extends BaseService {
  private formId: number

  constructor(formId: number) {
    super()
    this.formId = formId
  }

  static async perform(formId: number): Promise<Expense[]> {
    const instance = new this(formId)
    return instance.perform()
  }

  async perform(): Promise<Expense[]> {
    const stops = await Stop.findAll({
      where: { taid: this.formId },
      order: [
        ["departureDate", "ASC"],
        ["departureTime", "ASC"],
      ],
      include: ["location"],
    })

    // expense types are:
    // travel method
    // accommodations
    // meals and incidentals
    const estimates: Expense[] = []

    const travelMethodEstimates = this.buildTravelMethodExpenses(this.formId, stops)
    estimates.concat(travelMethodEstimates)

    return db("estimates").insert(estimates).returning("*")
  }

  private buildTravelMethodExpenses(formId: number, stops: Stop[]): Expense[] {
    const estimates: Expense[] = []
    const tripSegments = chunk(stops, 2)
    tripSegments.forEach(([fromStop, toStop]) => {
      const fromLocation = fromStop.location
      const toLocation = toStop.location
      const toTransport = toStop.transport

      if (isNil(fromLocation) || isNil(toLocation)) {
        throw new Error("missing location on stop")
      } else if (isNil(toTransport)) {
        throw new Error("missing transport on stop")
      }

      const fromCity = fromLocation.city
      const toCity = toLocation.city
      const description = `${toTransport} from ${fromCity} to ${toCity}`

      const cost = this.determineCost(toTransport, fromLocation, toLocation)

      const estimate = Expense.build({
        type: ExpenseVariants.ESTIMATE,
        taid: formId,
        currency: "CAD",
        expenseType: ExpenseTypes.TRANSPORTATION,
        description,
        cost,
        date: fromStop.departureDate,
      })

      estimates.push(estimate)
    })

    return estimates
  }

  private determineCost(
    travelMethod: string,
    fromDestination: Destination,
    toDestination: Destination
  ): number {
    switch (travelMethod) {
      case TRAVEL_METHODS.AIRCRAFT:
        // TODO: up to a maximum of 1000 across all stops
        return 350
      case TRAVEL_METHODS.PERSONAL_VEHICLE:
        // TODO: calculate using distance matrix
        return 123456789
      case TRAVEL_METHODS.POOL_VEHICLE:
      case TRAVEL_METHODS.RENTAL_VEHICLE:
        return 0
      default:
        return 0
    }
  }
}

export default BulkGenerate
