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

// Keep in sync with src/web/src/modules/travelForm/components/AccommodationTypeSelect.vue
// Until both are using a shared location
export const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

const MAXIUM_AIRCRAFT_ALLOWANCE = 1000
const AIRCRAFT_ALLOWANCE_PER_SEGMENT = 350
const DISTANCE_ALLOWANCE_PER_KILOMETER = 0.605
const HOTEL_ALLOWANCE_PER_NIGHT = 250
const PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT = 50

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

    const estimates: CreationAttributes<Expense>[] = []
    const tripSegments = chunk(stops, 2)
    for (const [fromStop, toStop] of tripSegments) {
      const fromAccommodationType = fromStop.accommodationType
      const fromDepartureDate = fromStop.departureDate
      const fromLocation = fromStop.location
      const fromTransport = fromStop.transport
      const toLocation = toStop.location
      const toDepartureDate = toStop.departureDate

      if (isNil(fromLocation)) {
        throw new Error(`Missing location on Stop#${fromStop.id}`)
      }
      if (isNil(fromTransport)) {
        throw new Error(`Missing transport on Stop#${fromStop.id}`)
      }
      if (isNil(fromDepartureDate)) {
        throw new Error(`Missing departure date on Stop#${fromStop.id}`)
      }
      if (isNil(fromAccommodationType)) {
        throw new Error(`Missing accommodation type on Stop#${fromStop.id}`)
      }
      if (isNil(toLocation)) {
        throw new Error(`Missing location on Stop#${toStop.id}`)
      }
      if (isNil(toDepartureDate)) {
        throw new Error(`Missing departure date on Stop#${toStop.id}`)
      }

      // expense types are:
      // travel method
      // accommodations
      // meals and incidentals
      const travelMethodEstimate = await this.buildTravelMethodEstimate({
        fromDepartureDate,
        fromLocation,
        fromTransport,
        toLocation,
      })
      const accommodationEstimate = this.buildAccommodationEstimate({
        fromAccommodationType,
        fromDepartureDate,
        toLocation,
        toDepartureDate,
      })

      estimates.push(travelMethodEstimate)
      estimates.push(accommodationEstimate)
    }

    return Expense.bulkCreate(estimates)
  }

  private async buildTravelMethodEstimate({
    fromDepartureDate,
    fromLocation,
    fromTransport,
    toLocation,
  }: {
    fromDepartureDate: Date
    fromLocation: Destination
    fromTransport: string
    toLocation: Destination
  }): Promise<CreationAttributes<Expense>> {
    const fromCity = fromLocation.city
    const toCity = toLocation.city
    const description = `${fromTransport} from ${fromCity} to ${toCity}`

    const cost = await this.determineTravelMethodCost(fromTransport, fromCity, toCity)

    return {
      type: ExpenseVariants.ESTIMATE,
      taid: this.formId,
      currency: "CAD",
      expenseType: ExpenseTypes.TRANSPORTATION,
      description,
      cost,
      date: fromDepartureDate,
    }
  }

  private buildAccommodationEstimate({
    fromAccommodationType,
    fromDepartureDate,
    toLocation,
    toDepartureDate,
  }: {
    fromAccommodationType: string
    fromDepartureDate: Date
    toLocation: Destination
    toDepartureDate: Date
  }): CreationAttributes<Expense> {
    const toCity = toLocation.city
    const description = `${fromAccommodationType} in ${toCity}`

    const cost = this.determineAccommodationCost(
      fromAccommodationType,
      fromDepartureDate,
      toDepartureDate
    )

    return {
      type: ExpenseVariants.ESTIMATE,
      taid: this.formId,
      currency: "CAD",
      expenseType: ExpenseTypes.ACCOMODATIONS,
      description,
      cost,
      date: fromDepartureDate,
    }
  }

  private async determineTravelMethodCost(
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

  private determineAccommodationCost(
    accommodationType: string,
    fromDepartureDate: Date,
    toDepartureDate: Date
  ): number {
    const numberOfNights = this.calculateNumberOfNights(fromDepartureDate, toDepartureDate)

    switch (accommodationType) {
      case ACCOMMODATION_TYPES.HOTEL:
        return numberOfNights * HOTEL_ALLOWANCE_PER_NIGHT
      case ACCOMMODATION_TYPES.PRIVATE:
        return numberOfNights * PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT
      default:
        return 0
    }
  }

  private calculateNumberOfNights(checkInDate: Date, checkOutDate: Date): number {
    const differenceInMs = checkInDate.getTime() - checkOutDate.getTime()
    const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
    const differenceInDays = Math.floor(differenceInDaysAsFloat)

    return differenceInDays
  }
}

export default BulkGenerate
