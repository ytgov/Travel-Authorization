import { clone, isNil, max, min, times } from "lodash"
import { CreationAttributes, Op } from "sequelize"

import { DistanceMatrix, Expense, Location, PerDiem, Stop, TravelSegment } from "@/models"

import BaseService from "@/services/base-service"
import { BulkGenerate } from "@/services/estimates"
import { ClaimTypes, LocationTypes } from "@/models/per-diem"

const MAXIUM_AIRCRAFT_ALLOWANCE = 1000
const AIRCRAFT_ALLOWANCE_PER_SEGMENT = 350
const DISTANCE_ALLOWANCE_PER_KILOMETER = 0.605
const HOTEL_ALLOWANCE_PER_NIGHT = 250
const PRIVATE_ACCOMMODATION_ALLOWANCE_PER_NIGHT = 50

type BulkGenerateServiceOptions = {
  daysOffTravelStatus: number
}

export class BulkGenerateService extends BaseService {
  private travelAuthorizationId: number
  private travelSegments: TravelSegment[]
  private daysOffTravelStatus: number
  private firstTravelSegment: TravelSegment
  private lastTravelSegment: TravelSegment
  private aircraftAllowanceRemaining: number

  constructor(
    travelAuthorizationId: number,
    travelSegments: TravelSegment[],
    { daysOffTravelStatus }: BulkGenerateServiceOptions
  ) {
    super()
    this.travelAuthorizationId = travelAuthorizationId
    this.travelSegments = travelSegments
    this.daysOffTravelStatus = daysOffTravelStatus
    this.firstTravelSegment = this.travelSegments[0]
    this.lastTravelSegment = this.travelSegments[this.travelSegments.length - 1]
    this.aircraftAllowanceRemaining = MAXIUM_AIRCRAFT_ALLOWANCE
  }

  async perform(): Promise<Expense[]> {
    const estimates: CreationAttributes<Expense>[] = []
    let index = 0
    for (const travelSegment of this.travelSegments) {
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
      const nextTravelSegment = this.travelSegments[index + 1]
      if (!isNil(accommodationType) && !isNil(nextTravelSegment)) {
        const accommodationDepartureAt = nextTravelSegment.departureAt
        if (isNil(accommodationDepartureAt)) {
          throw new Error(`Missing departure date on TravelSegment#${nextTravelSegment.id}`)
        }

        const accommodationEstimates = this.buildAccommodationEstimates({
          location: travelSegment.arrivalLocation,
          accommodationType,
          arrivalAt: travelSegment.departureAt,
          departureAt: accommodationDepartureAt,
        })
        estimates.push(...accommodationEstimates)
      }

      index += 1
    }

    const mealsAndIncidentalsEstimates = await this.buildMealsAndIncidentalsEstimates()
    estimates.push(...mealsAndIncidentalsEstimates)

    if (this.daysOffTravelStatus > 0) {
      if (isNil(this.lastTravelSegment.departureAt)) {
        throw new Error(`Missing departure date on TravelSegment#${this.lastTravelSegment.id}`)
      }
      const nonTravelStatusDaysCorrectingLine = BulkGenerate.buildNonTravelStatusDaysCorrectingLine(
        {
          estimates,
          daysOffTravelStatus: this.daysOffTravelStatus,
          travelAuthorizationId: this.travelAuthorizationId,
          travelEndAt: this.lastTravelSegment.departureAt,
        }
      )
      estimates.push(nonTravelStatusDaysCorrectingLine)
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
        expenseType: Expense.ExpenseTypes.ACCOMMODATIONS,
        description,
        cost,
        date: stayedAt,
      }
    })
  }

  private async buildMealsAndIncidentalsEstimates(): Promise<CreationAttributes<Expense>[]> {
    const travelStartAt = this.firstTravelSegment.departureAtWithTimeFallback(
      TravelSegment.FallbackTimes.BEGINNING_OF_DAY
    )
    const travelEndAt = this.lastTravelSegment.departureAtWithTimeFallback(
      TravelSegment.FallbackTimes.END_OF_DAY
    )
    if (isNil(travelStartAt)) {
      throw new Error(`Missing departure date on TravelSegment#${this.firstTravelSegment.id}`)
    }
    if (isNil(travelEndAt)) {
      throw new Error(`Missing departure date on TravelSegment#${this.lastTravelSegment.id}`)
    }

    const claimsPerDay = BulkGenerate.determineClaimsPerDay(travelStartAt, travelEndAt)

    let estimates = []
    for (let { date, claims } of claimsPerDay) {
      // trueEndDate is a hack because my brain is fried
      // I'm probably doing something conceptually wrong here
      // maybe I should be setting the fallback time travel segment separately?
      const trueEndDate = min([date, this.lastTravelSegment.departureAt]) as Date

      const location = BulkGenerate.determineLocationFromDate(this.travelSegments, trueEndDate)
      const province = location.province
      const description = claims.join("/")
      const cost = await this.determinePerDiemCost(province, claims)
      if (isNil(cost)) {
        throw new Error(`Missing per diem cost for province=${province} and claims=${claims}`)
      }

      estimates.push({
        type: Expense.Types.ESTIMATE,
        travelAuthorizationId: this.travelAuthorizationId,
        currency: "CAD",
        expenseType: Expense.ExpenseTypes.MEALS_AND_INCIDENTALS,
        description,
        cost,
        date,
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

  private async determinePerDiemCost(province: string, claims: ClaimTypes[]): Promise<number> {
    const location = this.determineLocationFromProvince(province)

    return PerDiem.sum("amount", {
      where: {
        claim: { [Op.in]: claims },
        location,
      },
    })
  }

  private determineLocationFromProvince(province: string): LocationTypes {
    switch (province) {
      case "YT":
        return PerDiem.LocationTypes.YUKON
      case "NT":
        return PerDiem.LocationTypes.NWT
      case "NU":
        return PerDiem.LocationTypes.NUNAVUT
      // TODO: Handle Alaska and the US in the future
      // I don't see any destination data for this yet, so leaving for now.
      default:
        return PerDiem.LocationTypes.CANADA
    }
  }
}

export default BulkGenerateService
