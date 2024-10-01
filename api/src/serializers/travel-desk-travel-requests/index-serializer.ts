import { first, isEmpty, isNil, isUndefined, last, pick } from "lodash"

import { TravelAuthorization, TravelDeskTravelRequest, TravelSegment, User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type TravelDeskTravelRequestIndexView = Pick<
  TravelDeskTravelRequest,
  | "id"
  | "travelAuthorizationId"
  | "travelAgencyId"
  | "legalFirstName"
  | "legalMiddleName"
  | "legalLastName"
  | "strAddress"
  | "city"
  | "province"
  | "postalCode"
  | "passportCountry"
  | "passportNum"
  | "travelPurpose"
  | "travelLocation"
  | "travelNotes"
  | "busPhone"
  | "busEmail"
  | "travelContact"
  | "travelPhone"
  | "travelEmail"
  | "additionalInformation"
  | "travelDeskOfficer"
  | "isInternationalTravel"
  | "status"
  | "createdAt"
  | "updatedAt"
> & {
  // extra fields
  userDisplayName: string
  department: string
  branch: string
  travelStartDate: string
  travelEndDate: string
  locationsTraveled: string
  requestedOptions: string
}

export class IndexSerializer extends BaseSerializer<TravelDeskTravelRequest> {
  constructor(
    protected record: TravelDeskTravelRequest,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): TravelDeskTravelRequestIndexView {
    const { firstName, lastName } = this.travelAuthorizationUser
    const userDisplayName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown"

    const department = this.travelAuthorization.department ?? ""
    const branch = this.travelAuthorization.branch ?? ""
    const travelStartDate = this.determineStartDate(this.travelSegments)
    const travelEndDate = this.determineEndDate(
      this.travelSegments,
      this.travelAuthorization.dateBackToWork
    )
    const locationsTraveled = this.determineLocationsTraveled(this.travelSegments)
    const requestedOptions = this.determineRequestedOptions(this.record)

    return {
      ...pick(this.record.dataValues, [
        "id",
        "travelAuthorizationId",
        "travelAgencyId",
        "legalFirstName",
        "legalMiddleName",
        "legalLastName",
        "strAddress",
        "city",
        "province",
        "postalCode",
        "passportCountry",
        "passportNum",
        "travelPurpose",
        "travelLocation",
        "travelNotes",
        "busPhone",
        "busEmail",
        "travelContact",
        "travelPhone",
        "travelEmail",
        "additionalInformation",
        "travelDeskOfficer",
        "isInternationalTravel",
        "status",
        "createdAt",
        "updatedAt",
      ]),
      userDisplayName,
      department,
      branch,
      travelStartDate,
      travelEndDate,
      locationsTraveled,
      requestedOptions,
    }
  }

  private get travelAuthorization(): TravelAuthorization {
    if (isUndefined(this.record.travelAuthorization)) {
      throw new Error("travelAuthorization association is missing")
    }

    const { travelAuthorization } = this.record

    if (isUndefined(travelAuthorization.user)) {
      throw new Error("travelAuthorization.user association is missing")
    }

    return this.record.travelAuthorization
  }

  private get travelSegments(): TravelSegment[] {
    if (isUndefined(this.travelAuthorization.travelSegments)) {
      throw new Error("travelAuthorization.travelSegments association is missing")
    }

    return this.travelAuthorization.travelSegments
  }

  private get travelAuthorizationUser(): User {
    if (isUndefined(this.travelAuthorization.user)) {
      throw new Error("travelAuthorization.user association is missing")
    }

    return this.travelAuthorization.user
  }

  private determineStartDate(travelSegments: TravelSegment[]): string {
    const firstTravelSegment = first(travelSegments)
    if (isUndefined(firstTravelSegment)) {
      return ""
    }

    const { departureOnAsString } = firstTravelSegment
    if (isNil(departureOnAsString)) {
      return ""
    }

    return departureOnAsString
  }

  private determineEndDate(travelSegments: TravelSegment[], dateBackToWork: Date | null): string {
    if (!isNil(dateBackToWork)) {
      return dateBackToWork.toISOString().slice(0, 10)
    }

    const lastTravelSegment = last(travelSegments)
    if (isUndefined(lastTravelSegment)) {
      return ""
    }

    const { departureOnAsString } = lastTravelSegment
    if (isNil(departureOnAsString)) {
      return ""
    }

    return departureOnAsString
  }

  private determineLocationsTraveled(travelSegments: TravelSegment[]): string {
    const names = new Set()

    for (const travelSegment of travelSegments) {
      const { departureLocation, arrivalLocation } = travelSegment
      if (!isNil(departureLocation)) {
        const departureName = `${departureLocation.city} (${departureLocation.province})`
        names.add(departureName)
      }

      if (!isNil(arrivalLocation)) {
        const arrivalName = `${arrivalLocation.city} (${arrivalLocation.province})`
        names.add(arrivalName)
      }
    }

    return Array.from(names).join(", ")
  }

  private determineRequestedOptions(travelDeskTravelRequest: TravelDeskTravelRequest): string {
    const requested = []

    if (!isEmpty(travelDeskTravelRequest.flightRequests)) {
      requested.push("flight")
    }

    if (!isEmpty(travelDeskTravelRequest.hotels)) {
      requested.push("hotel")
    }

    if (!isEmpty(travelDeskTravelRequest.rentalCars)) {
      requested.push("rental car")
    }

    if (!isEmpty(travelDeskTravelRequest.otherTransportations)) {
      requested.push("transportation")
    }

    return requested.join(", ")
  }
}

export default IndexSerializer
