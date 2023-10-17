import { clone, isNil, max, min, times } from "lodash"
import { CreationAttributes, Op } from "sequelize"

import {
  AccommodationTypes,
  ClaimTypes,
  DistanceMatrix,
  Expense,
  Location,
  LocationTypes,
  PerDiem,
  Stop,
  TravelAuthorization,
  TravelMethods,
} from "@/models"
import BaseService from "@/services/base-service"

const MAXIUM_AIRCRAFT_ALLOWANCE = 1000
const AIRCRAFT_ALLOWANCE_PER_SEGMENT = 350
const DISTANCE_ALLOWANCE_PER_KILOMETER = 0.605
const HOTEL_ALLOWANCE_PER_NIGHT = 250
const PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT = 50

export class BulkGenerate extends BaseService {
  private travelAuthorizationId: number
  private aircraftAllowanceRemaining: number

  constructor(travelAuthorizationId: number) {
    super()
    this.travelAuthorizationId = travelAuthorizationId
    this.aircraftAllowanceRemaining = MAXIUM_AIRCRAFT_ALLOWANCE
  }

  static async perform(travelAuthorizationId: number): Promise<Expense[]> {
    const instance = new this(travelAuthorizationId)
    return instance.perform()
  }

  async perform(): Promise<Expense[]> {
    const travelAuthorization = await TravelAuthorization.findByPk(this.travelAuthorizationId)
    if (isNil(travelAuthorization)) {
      throw new Error(`TravelAuthorization not found for id=${this.travelAuthorizationId}`)
    }

    const stops = await Stop.findAll({
      where: { taid: this.travelAuthorizationId },
      order: [
        ["departureDate", "ASC"],
        ["departureTime", "ASC"],
      ],
      include: ["location"],
    })
    const tripSegments = await this.buildTripSegments({ travelAuthorization, stops })

    const estimates: CreationAttributes<Expense>[] = []
    let index = 0
    for (const [fromStop, toStop] of tripSegments) {
      const fromDepartureAt = fromStop.departureAt
      const fromLocation = fromStop.location
      const fromTransport = fromStop.transport
      const toLocation = toStop.location

      if (isNil(fromLocation)) {
        throw new Error(`Missing location on Stop#${fromStop.id}`)
      }
      if (isNil(fromTransport)) {
        throw new Error(`Missing transport on Stop#${fromStop.id}`)
      }
      if (isNil(fromDepartureAt)) {
        throw new Error(`Missing departure date on Stop#${fromStop.id}`)
      }
      if (isNil(toLocation)) {
        throw new Error(`Missing location on Stop#${toStop.id}`)
      }

      const travelMethodEstimate = await this.buildTravelMethodEstimate({
        fromDepartureAt,
        fromLocation,
        fromTransport,
        toLocation,
      })
      estimates.push(travelMethodEstimate)

      const accommodationType = toStop.accommodationType
      const nextSegment = tripSegments[index + 1]
      if (!isNil(accommodationType) && !isNil(nextSegment)) {
        const [nextFromStop, _] = nextSegment
        const accommodationDepartureAt = nextFromStop.departureAt
        if (isNil(accommodationDepartureAt)) {
          throw new Error(`Missing departure date on Stop#${nextFromStop.id}`)
        }

        const accommodationEstimates = this.buildAccommodationEstimates({
          location: toLocation,
          accommodationType,
          arrivalAt: fromDepartureAt,
          departureAt: accommodationDepartureAt,
        })
        estimates.push(...accommodationEstimates)
      }

      if (!isNil(nextSegment)) {
        const [nextFromStop, _] = nextSegment
        const departureAt = nextFromStop.departureAt
        if (isNil(departureAt)) {
          throw new Error(`Missing departure date on Stop#${nextFromStop.id}`)
        }
        const mealsAndIncidentalsEstimates = await this.buildMealsAndIncidentalsEstimates({
          location: toLocation,
          arrivalAt: fromDepartureAt,
          departureAt,
        })
        estimates.push(...mealsAndIncidentalsEstimates)
      }

      index += 1
    }

    return Expense.bulkCreate(estimates)
  }

  // TODO: investigate having a tripSegments model in the database
  private async buildTripSegments({
    travelAuthorization,
    stops,
  }: {
    travelAuthorization: TravelAuthorization
    stops: Stop[]
  }): Promise<[Stop, Stop][]> {
    if (stops.length < 2) {
      throw new Error("Must have at least 2 stops to build a trip segment")
    }

    const isRoundTrip = travelAuthorization.oneWayTrip !== true && travelAuthorization.multiStop !== true
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
    fromLocation: Location
    fromTransport: string
    toLocation: Location
  }): Promise<CreationAttributes<Expense>> {
    const fromCity = fromLocation.city
    const toCity = toLocation.city
    const description = `${fromTransport} from ${fromCity} to ${toCity}`

    const cost = await this.determineTravelMethodCost(fromTransport, fromCity, toCity)

    return {
      type: Expense.Types.ESTIMATE,
      travelAuthorizationId: this.travelAuthorizationId,
      currency: "CAD",
      expenseType: Expense.ExpenseTypes.TRANSPORTATION,
      description,
      cost,
      date: fromDepartureAt,
    }
  }

  private buildAccommodationEstimates({
    location,
    accommodationType,
    arrivalAt,
    departureAt,
  }: {
    location: Location
    accommodationType: string
    arrivalAt: Date
    departureAt: Date
  }): CreationAttributes<Expense>[] {
    const city = location.city
    const description = `${accommodationType} in ${city}`

    const numberOfNights = this.calculateNumberOfNights(arrivalAt, departureAt)
    return times(numberOfNights, (index) => {
      let stayedAt = clone(arrivalAt)
      stayedAt.setDate(arrivalAt.getDate() + index)

      const cost = this.determineAccommodationCost(accommodationType)
      return {
        type: Expense.Types.ESTIMATE,
        travelAuthorizationId: this.travelAuthorizationId,
        currency: "CAD",
        expenseType: Expense.ExpenseTypes.ACCOMODATIONS,
        description,
        cost,
        date: stayedAt,
      }
    })
  }

  private async buildMealsAndIncidentalsEstimates({
    location,
    arrivalAt,
    departureAt,
  }: {
    location: Location
    arrivalAt: Date
    departureAt: Date
  }): Promise<CreationAttributes<Expense>[]> {
    const numberOfNights = this.calculateNumberOfNights(arrivalAt, departureAt)

    let estimates = []
    for (let index = 0; index < numberOfNights; index += 1) {
      let stayedAtStartOfDay = clone(arrivalAt)
      stayedAtStartOfDay.setDate(arrivalAt.getDate() + index)
      stayedAtStartOfDay.setHours(0, 0, 0, 0)
      const stayedAt = max([arrivalAt, stayedAtStartOfDay]) as Date

      if (stayedAt.getTime() > departureAt.getTime()) {
        throw new Error("Stayed at date cannot be after departure date")
      }

      const province = location.province
      const claims = this.determineClaimTypes(stayedAt, departureAt)
      const description = claims.join("/")
      const cost = await this.determinePerDiemCost(province, claims)

      estimates.push({
        type: Expense.Types.ESTIMATE,
        travelAuthorizationId: this.travelAuthorizationId,
        currency: "CAD",
        expenseType: Expense.ExpenseTypes.MEALS_AND_INCIDENTALS,
        description,
        cost,
        date: stayedAt,
      })
    }

    return estimates
  }

  private async determineTravelMethodCost(
    travelMethod: string,
    fromCity: string,
    toCity: string
  ): Promise<number> {
    switch (travelMethod) {
      case TravelMethods.AIRCRAFT:
        return this.determineAicraftAllowance()
      case TravelMethods.PERSONAL_VEHICLE:
        return this.determinePersonalVehicleAllowance(fromCity, toCity)
      case TravelMethods.POOL_VEHICLE:
      case TravelMethods.RENTAL_VEHICLE:
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

  private determineAccommodationCost(accommodationType: string): number {
    switch (accommodationType) {
      case AccommodationTypes.HOTEL:
        return 1 * HOTEL_ALLOWANCE_PER_NIGHT
      // TODO: determine if Private Accommodation is part of the max daily per-diem
      case AccommodationTypes.PRIVATE:
        return 1 * PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT
      default:
        return 0
    }
  }

  private calculateNumberOfNights(checkInAt: Date, checkOutAt: Date): number {
    const differenceInMs = checkOutAt.getTime() - checkInAt.getTime()
    const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
    const differenceInDays = Math.floor(differenceInDaysAsFloat)

    return max([0, differenceInDays]) as number
  }

  // Assuming a meal every 4 hours
  // e.g 0, 4, 8 so any 8 hour period is a "full day"
  // Assuming you can only claim the max daily after 12 hours
  private determineClaimTypes(stayedAt: Date, departureAt: Date): ClaimTypes[] {
    let leftAtEndOfDay = clone(stayedAt)
    leftAtEndOfDay.setHours(23, 59, 59, 999)
    const leftAt = min([leftAtEndOfDay, departureAt]) as Date

    const startAtHour = stayedAt.getHours()
    const hoursBetweenDates = this.calculateHoursBetweenDates(stayedAt, leftAt)

    if (hoursBetweenDates >= 12) {
      return [ClaimTypes.MAXIMUM_DAILY]
    } else if (hoursBetweenDates >= 8) {
      return [ClaimTypes.BREAKFAST, ClaimTypes.LUNCH, ClaimTypes.DINNER]
    } else if (startAtHour < 11 && hoursBetweenDates >= 4) {
      return [ClaimTypes.BREAKFAST, ClaimTypes.LUNCH]
    } else if (startAtHour < 11) {
      return [ClaimTypes.BREAKFAST]
    } else if (startAtHour < 16 && hoursBetweenDates >= 4) {
      return [ClaimTypes.LUNCH, ClaimTypes.DINNER]
    } else if (startAtHour < 16) {
      return [ClaimTypes.LUNCH]
    } else {
      return [ClaimTypes.DINNER]
    }
  }

  private async determinePerDiemCost(province: string, claims: ClaimTypes[]): Promise<number> {
    const location = this.determineLocationFromProvince(province)

    return PerDiem.sum("amount", {
      where: {
        claim: { [Op.in]: claims },
        location,
      },
    })
  }

  private calculateHoursBetweenDates(startDate: Date, endDate: Date): number {
    const millisecondsPerHour = 1000 * 60 * 60
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime()
    return differenceInMilliseconds / millisecondsPerHour
  }

  private determineLocationFromProvince(province: string): LocationTypes {
    switch (province) {
      case "YT":
        return LocationTypes.YUKON
      case "NT":
        return LocationTypes.NWT
      case "NU":
        return LocationTypes.NUNAVUT
      // TODO: Handle Alaska and the US in the future
      // I don't see any destination data for this yet, so leaving for now.
      default:
        return LocationTypes.CANADA
    }
  }
}

export default BulkGenerate
