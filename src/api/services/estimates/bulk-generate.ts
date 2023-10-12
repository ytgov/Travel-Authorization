import { chunk, isNil, min } from "lodash"
import { CreationAttributes } from "sequelize"

import {
  Destination,
  DistanceMatrix,
  Expense,
  ExpenseTypes,
  Types as ExpenseVariants,
  Stop,
} from "../../models"
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

const MAXIUM_AIRCRAFT_ALLOWANCE = 1000
const AIRCRAFT_ALLOWANCE_PER_SEGMENT = 350
const DISTANCE_ALLOWANCE_PER_KILOMETER = 0.605

export class BulkGenerate extends BaseService {
  private formId: number
  private aircraftAllowanceRemaining: number

  constructor(formId: number) {
    super()
    this.formId = formId
    this.aircraftAllowanceRemaining = MAXIUM_AIRCRAFT_ALLOWANCE
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
    const estimates: CreationAttributes<Expense>[] = []

    const travelMethodEstimates = await this.buildTravelMethodExpenses(this.formId, stops)
    const accommodationEstimates = await this.buildAccommodationExpenses(this.formId, stops)
    estimates.concat(travelMethodEstimates)
    estimates.concat(accommodationEstimates)

    return Expense.bulkCreate(estimates)
  }

  private async buildTravelMethodExpenses(
    formId: number,
    stops: Stop[]
  ): Promise<CreationAttributes<Expense>[]> {
    const estimates: CreationAttributes<Expense>[] = []
    const tripSegments = chunk(stops, 2)

    for (const [fromStop, toStop] of tripSegments) {
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

      const cost = await this.determineCost(toTransport, fromCity, toCity)

      const estimate: CreationAttributes<Expense> = {
        type: ExpenseVariants.ESTIMATE,
        taid: formId,
        currency: "CAD",
        expenseType: ExpenseTypes.TRANSPORTATION,
        description,
        cost,
        date: fromStop.departureDate,
      }

      estimates.push(estimate)
    }

    return estimates
  }

  private async buildAccommodationExpenses(formId: number, stops: Stop[]): Promise<CreationAttributes<Expense>[]> {
    const estimates: CreationAttributes<Expense>[] = []
    const tripSegments = chunk(stops, 2)

    for (const [fromStop, toStop] of tripSegments) {
      // estimates.push(estimate)
    }
    return estimates
  }

  private async determineCost(
    travelMethod: string,
    fromCity: string,
    toCity: string
  ): Promise<number> {
    switch (travelMethod) {
      case TRAVEL_METHODS.AIRCRAFT:
        return this.determineAicraftAllowance()
      case TRAVEL_METHODS.PERSONAL_VEHICLE:
        return this.determinePersonalVehicleAllowance(fromCity, toCity)
      case TRAVEL_METHODS.POOL_VEHICLE:
      case TRAVEL_METHODS.RENTAL_VEHICLE:
        return 0
      default:
        return 0
    }
  }

  private determineAicraftAllowance(): number {
    const allowance = min([
      this.aircraftAllowanceRemaining,
      AIRCRAFT_ALLOWANCE_PER_SEGMENT,
    ]) as number
    this.aircraftAllowanceRemaining -= allowance
    return allowance
  }

  private async determinePersonalVehicleAllowance(
    fromCity: string,
    toCity: string
  ): Promise<number> {
    const distanceMatrix = await DistanceMatrix.findOne({
      where: { origin: fromCity, destination: toCity },
    })
    if (isNil(distanceMatrix) || isNil(distanceMatrix.kilometers)) return 0

    const { kilometers } = distanceMatrix
    return kilometers * DISTANCE_ALLOWANCE_PER_KILOMETER
  }
}

export default BulkGenerate
