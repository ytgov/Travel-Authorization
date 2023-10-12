import { isNil, min } from "lodash"
import { CreationAttributes } from "sequelize"

import {
  ClaimTypes,
  Destination,
  DistanceMatrix,
  Expense,
  ExpenseTypes,
  Types as ExpenseVariants,
  Form,
  LocationTypes,
  PerDiem,
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
    const form = await Form.findByPk(this.formId)
    if (isNil(form)) {
      throw new Error(`Form not found for id=${this.formId}`)
    }

    const stops = await Stop.findAll({
      where: { taid: this.formId },
      order: [
        ["departureDate", "ASC"],
        ["departureTime", "ASC"],
      ],
      include: ["location"],
    })
    const tripSegments = await this.buildTripSegments({ form, stops })

    const estimates: CreationAttributes<Expense>[] = []
    for (const [fromStop, toStop] of tripSegments) {
      const fromAccommodationType = fromStop.accommodationType
      const fromDepartureAt = fromStop.departureAt
      const fromLocation = fromStop.location
      const fromTransport = fromStop.transport
      const toLocation = toStop.location
      const toDepartureAt = toStop.departureAt

      if (isNil(fromLocation)) {
        throw new Error(`Missing location on Stop#${fromStop.id}`)
      }
      if (isNil(fromTransport)) {
        throw new Error(`Missing transport on Stop#${fromStop.id}`)
      }
      if (isNil(fromDepartureAt)) {
        throw new Error(`Missing departure date on Stop#${fromStop.id}`)
      }
      if (isNil(fromAccommodationType)) {
        throw new Error(`Missing accommodation type on Stop#${fromStop.id}`)
      }
      if (isNil(toLocation)) {
        throw new Error(`Missing location on Stop#${toStop.id}`)
      }
      if (isNil(toDepartureAt)) {
        throw new Error(`Missing departure date on Stop#${toStop.id}`)
      }

      const travelMethodEstimate = await this.buildTravelMethodEstimate({
        fromDepartureAt,
        fromLocation,
        fromTransport,
        toLocation,
      })
      const accommodationEstimate = this.buildAccommodationEstimate({
        fromAccommodationType,
        fromDepartureAt,
        toLocation,
        toDepartureAt,
      })
      const mealsAndIncidentalsEstimate = await this.buildMealsAndIncidentalsEstimate({
        fromDepartureAt,
        toLocation,
        toDepartureAt,
      })

      estimates.push(travelMethodEstimate)
      estimates.push(accommodationEstimate)
      estimates.push(mealsAndIncidentalsEstimate)
    }

    return Expense.bulkCreate(estimates)
  }

  // TODO: investigate having a tripSegments model in the database
  private async buildTripSegments({
    form,
    stops,
  }: {
    form: Form
    stops: Stop[]
  }): Promise<[Stop, Stop][]> {
    if (stops.length < 2) {
      throw new Error("Must have at least 2 stops to build a trip segment")
    }

    const isRoundTrip = form.oneWayTrip !== true && form.multiStop !== true
    if (isRoundTrip) {
      return stops.reduce((tripSegments: [Stop, Stop][], stop, index) => {
        const isLastStop = index === stops.length - 1
        if (isLastStop) {
          tripSegments.push([stop, stops[0]])
        } else {
          tripSegments.push([stop, stops[index + 1]])
        }
        return tripSegments
      }, [])
    }

    return stops.reduce((tripSegments: [Stop, Stop][], stop, index) => {
      const isLastStop = index === stops.length - 1
      if (isLastStop) {
        // noop
      } else {
        tripSegments.push([stop, stops[index + 1]])
      }
      return tripSegments
    }, [])
  }

  private async buildTravelMethodEstimate({
    fromDepartureAt,
    fromLocation,
    fromTransport,
    toLocation,
  }: {
    fromDepartureAt: Date
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
      date: fromDepartureAt,
    }
  }

  private buildAccommodationEstimate({
    fromAccommodationType,
    fromDepartureAt,
    toLocation,
    toDepartureAt,
  }: {
    fromAccommodationType: string
    fromDepartureAt: Date
    toLocation: Destination
    toDepartureAt: Date
  }): CreationAttributes<Expense> {
    const toCity = toLocation.city
    const description = `${fromAccommodationType} in ${toCity}`

    const cost = this.determineAccommodationCost(
      fromAccommodationType,
      fromDepartureAt,
      toDepartureAt
    )

    return {
      type: ExpenseVariants.ESTIMATE,
      taid: this.formId,
      currency: "CAD",
      expenseType: ExpenseTypes.ACCOMODATIONS,
      description,
      cost,
      date: fromDepartureAt,
    }
  }

  private async buildMealsAndIncidentalsEstimate({
    fromDepartureAt,
    toLocation,
    toDepartureAt,
  }: {
    fromDepartureAt: Date
    toLocation: Destination
    toDepartureAt: Date
  }): Promise<CreationAttributes<Expense>> {
    const toProvince = toLocation.province
    const description = this.buildMealsAndIncidentalsDescription()

    const cost = await this.determinePerDiemCost(toProvince, fromDepartureAt, toDepartureAt)

    return {
      type: ExpenseVariants.ESTIMATE,
      taid: this.formId,
      currency: "CAD",
      expenseType: ExpenseTypes.MEALS_AND_INCIDENTALS,
      description,
      cost,
      date: fromDepartureAt,
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
    fromDepartureAt: Date,
    toDepartureAt: Date
  ): number {
    const numberOfNights = this.calculateNumberOfNights(fromDepartureAt, toDepartureAt)

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

  private buildMealsAndIncidentalsDescription(): string {
    // TODO: figure out how to count meals
    return "Full Day" // or Breakfast/Lunch or Breakfast
  }

  private async determinePerDiemCost(
    toProvince: string,
    fromDepartureAt: Date,
    toDepartureAt: Date
  ): Promise<number> {
    const claim = this.determineClaimType(fromDepartureAt, toDepartureAt)

    // TODO: add in the rest of these computations
    switch (toProvince) {
      case "YT":
        const perDiem = await PerDiem.findOne({
          where: { claim, location: LocationTypes.YUKON },
        })
        if (isNil(perDiem) || isNil(perDiem.amount)) return 0

        const { amount } = perDiem
        return amount
      default:
        return 0
    }
  }

  private determineClaimType(fromDepartureAt: Date, toDepartureAt: Date): ClaimTypes {
    // TODO: figure out how to compute claim type
    return ClaimTypes.MAXIMUM_DAILY
  }
}

export default BulkGenerate
