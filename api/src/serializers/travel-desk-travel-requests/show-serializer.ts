import { pick } from "lodash"

import { TravelDeskTravelRequest, User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type TravelDeskTravelRequestShowView = Pick<
  TravelDeskTravelRequest,
  | "id"
  | "travelAuthorizationId"
  | "travelAgencyId"
  | "legalFirstName"
  | "legalLastName"
  | "strAddress"
  | "city"
  | "province"
  | "postalCode"
  | "legalMiddleName"
  | "travelPurpose"
  | "busPhone"
  | "busEmail"
  | "status"
  | "birthDate"
  | "isInternationalTravel"
  | "passportCountry"
  | "passportNum"
  | "travelLocation"
  | "travelNotes"
  | "travelContact"
  | "travelPhone"
  | "travelEmail"
  | "additionalInformation"
  | "travelDeskOfficer"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<TravelDeskTravelRequest> {
  constructor(
    protected record: TravelDeskTravelRequest,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): TravelDeskTravelRequestShowView {
    return pick(this.record, [
      "id",
      "travelAuthorizationId",
      "travelAgencyId",
      "legalFirstName",
      "legalLastName",
      "strAddress",
      "city",
      "province",
      "postalCode",
      "legalMiddleName",
      "travelPurpose",
      "busPhone",
      "busEmail",
      "status",
      "birthDate",
      "isInternationalTravel",
      "passportCountry",
      "passportNum",
      "travelLocation",
      "travelNotes",
      "travelContact",
      "travelPhone",
      "travelEmail",
      "additionalInformation",
      "travelDeskOfficer",
      "createdAt",
      "updatedAt",
    ])
  }
}

export default ShowSerializer
