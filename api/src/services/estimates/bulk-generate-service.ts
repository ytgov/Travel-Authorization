import { clone, isNil, max, min, times } from "lodash"
import { CreationAttributes, Op } from "sequelize"

import {
  ClaimTypes,
  DistanceMatrix,
  Expense,
  Location,
  LocationTypes,
  PerDiem,
  Stop,
  TravelAuthorization,
} from "@/models"

import BaseService from "@/services/base-service"
import { TravelSegments } from "@/services"
import { BulkGenerate } from "@/services/estimates"

const MAXIUM_AIRCRAFT_ALLOWANCE = 1000
const AIRCRAFT_ALLOWANCE_PER_SEGMENT = 350
const DISTANCE_ALLOWANCE_PER_KILOMETER = 0.605
const HOTEL_ALLOWANCE_PER_NIGHT = 250
const PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT = 50

export class BulkGenerateService extends BaseService {
  private travelAuthorizationId: number
  private aircraftAllowanceRemaining: number

  constructor(travelAuthorizationId: number) {
    super()
    this.travelAuthorizationId = travelAuthorizationId
    this.aircraftAllowanceRemaining = MAXIUM_AIRCRAFT_ALLOWANCE
  }

  async perform(): Promise<Expense[]> {
    const travelAuthorization = await TravelAuthorization.findByPk(this.travelAuthorizationId, {
      // TODO: consider performing travel segment creation before this service gets called?
      // that way we could include travel segments, and this whole file could be stop free.
      include: [
        {
          association: "stops",
          include: ["location"],
        },
      ],
      order: [
        ["stops", "departureDate", "ASC"],
        ["stops", "departureTime", "ASC"],
      ],
    })
    if (isNil(travelAuthorization)) {
      throw new Error(`TravelAuthorization not found for id=${this.travelAuthorizationId}`)
    }

    const travelSegmentsAttributes = travelAuthorization
      .buildTravelSegmentsFromStops()
      .map((t) => t.dataValues)
    await TravelSegments.BulkReplaceService.perform(
      this.travelAuthorizationId,
      travelSegmentsAttributes
    )
    const travelSegments = await travelAuthorization.getTravelSegments({
      include: ["departureLocation", "arrivalLocation"],
      order: [["segmentNumber", "ASC"]],
    })

    const estimates: CreationAttributes<Expense>[] = []
    let index = 0
    for (const travelSegment of travelSegments) {
      if (isNil(travelSegment.departureLocation)) {
        throw new Error(`Missing departure location on TravelSegment#${travelSegment.id}`)
      }
      if (isNil(travelSegment.arrivalLocation)) {
        throw new Error(`Missing arrival location on TravelSegment#${travelSegment.id}`)
      }
      if (isNil(travelSegment.modeOfTransport)) {
        throw new Error(`Missing mode of transport on TravelSegment#${travelSegment.id}`)
      }
      if (isNil(travelSegment.departureOn) || isNil(travelSegment.departureAt)) {
        throw new Error(`Missing departure date on TravelSegment#${travelSegment.id}`)
      }

      const travelMethodEstimate = await this.buildTravelMethodEstimate({
        modeOfTransport: travelSegment.modeOfTransport,
        departureCity: travelSegment.departureLocation.city,
        arrivalCity: travelSegment.arrivalLocation.city,
        departureAt: travelSegment.departureAt,
      })
      estimates.push(travelMethodEstimate)

      const accommodationType = travelSegment.accommodationType
      const nextTravelSegment = travelSegments[index + 1]
      if (!isNil(accommodationType) && !isNil(nextTravelSegment)) {
        const accommodationDepartureAt = nextTravelSegment.departureAt
        if (isNil(accommodationDepartureAt)) {
          throw new Error(`Missing departure date on Stop#${nextTravelSegment.id}`)
        }

        const accommodationEstimates = this.buildAccommodationEstimates({
          location: travelSegment.arrivalLocation,
          accommodationType,
          arrivalAt: travelSegment.departureAt,
          departureAt: accommodationDepartureAt,
        })
        estimates.push(...accommodationEstimates)
      }

      if (!isNil(nextTravelSegment)) {
        const departureAt = nextTravelSegment.departureAt
        if (isNil(departureAt)) {
          throw new Error(`Missing departure date on Stop#${nextTravelSegment.id}`)
        }
        const mealsAndIncidentalsEstimates = await this.buildMealsAndIncidentalsEstimates({
          location: travelSegment.arrivalLocation,
          arrivalAt: travelSegment.departureAt,
          departureAt,
        })
        estimates.push(...mealsAndIncidentalsEstimates)
      }

      index += 1
    }

    return Expense.bulkCreate(estimates)
  }

  private async buildTravelMethodEstimate({
    modeOfTransport,
    departureCity,
    arrivalCity,
    departureAt,
  }: {
    modeOfTransport: string
    departureCity: string
    arrivalCity: string
    departureAt: Date
  }): Promise<CreationAttributes<Expense>> {
    const description = `${modeOfTransport} from ${departureCity} to ${arrivalCity}`

    const cost = await this.determineTravelMethodCost(modeOfTransport, departureCity, arrivalCity)

    return {
      type: Expense.Types.ESTIMATE,
      travelAuthorizationId: this.travelAuthorizationId,
      currency: "CAD",
      expenseType: Expense.ExpenseTypes.TRANSPORTATION,
      description,
      cost,
      date: departureAt,
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

    const numberOfNights = BulkGenerate.calculateNumberOfNights(arrivalAt, departureAt)
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
    const numberOfDays = BulkGenerate.calculateNumberOfDays(arrivalAt, departureAt)

    let estimates = []
    for (let index = 0; index < numberOfDays; index += 1) {
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
      case Stop.TravelMethods.AIRCRAFT:
        return this.determineAicraftAllowance()
      case Stop.TravelMethods.PERSONAL_VEHICLE:
        return this.determinePersonalVehicleAllowance(fromCity, toCity)
      case Stop.TravelMethods.POOL_VEHICLE:
      case Stop.TravelMethods.RENTAL_VEHICLE:
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
      case Stop.AccommodationTypes.HOTEL:
        return 1 * HOTEL_ALLOWANCE_PER_NIGHT
      // TODO: determine if Private Accommodation is part of the max daily per-diem
      case Stop.AccommodationTypes.PRIVATE:
        return 1 * PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT
      default:
        return 0
    }
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

export default BulkGenerateService
