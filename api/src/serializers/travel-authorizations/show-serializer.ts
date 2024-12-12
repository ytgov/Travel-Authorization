import { isNil, pick } from "lodash"

import { TravelAuthorization, User } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import StopsSerializer, { StopDetailedView } from "@/serializers/stops-serializer"
import UsersSerializer, { UserDetailedView } from "@/serializers/users-serializer"
import StateFlagsSerializer, {
  type TravelAuthorizationStateFlagsView,
} from "@/serializers/travel-authorizations/state-flags-serializer"

export type TravelAuthorizationShowView = Pick<
  TravelAuthorization,
  | "id"
  | "slug"
  | "userId"
  | "preApprovalProfileId"
  | "purposeId"
  | "firstName"
  | "lastName"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "email"
  | "mailcode"
  | "daysOffTravelStatus"
  | "dateBackToWork"
  | "travelDuration"
  | "travelAdvance"
  | "eventName"
  | "summary"
  | "benefits"
  | "status"
  | "stepNumber"
  | "supervisorEmail"
  | "requestChange"
  | "denialReason"
  | "oneWayTrip"
  | "multiStop"
  | "createdBy"
  | "travelAdvanceInCents"
  | "allTravelWithinTerritory"
  | "createdAt"
  | "updatedAt"
> & {
  stops: StopDetailedView[]
  user: UserDetailedView
} & TravelAuthorizationStateFlagsView

// TODO: re-write this to use newer serializer pattern
export class ShowSerializer extends BaseSerializer<TravelAuthorization> {
  constructor(
    protected record: TravelAuthorization,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): TravelAuthorizationShowView {
    const stateFlagsAttributes = StateFlagsSerializer.perform(this.record, this.currentUser)

    return {
      ...pick(this.record.dataValues, [
        "id",
        "slug",
        "userId",
        "preApprovalProfileId",
        "purposeId",
        "firstName",
        "lastName",
        "department",
        "division",
        "branch",
        "unit",
        "email",
        "mailcode",
        "daysOffTravelStatus",
        "dateBackToWork",
        "travelDuration",
        "travelAdvance",
        "eventName",
        "summary",
        "benefits",
        "status",
        "stepNumber",
        "supervisorEmail",
        "requestChange",
        "denialReason",
        "oneWayTrip",
        "multiStop",
        "createdBy",
        "travelAdvanceInCents",
        "allTravelWithinTerritory",
        "createdAt",
        "updatedAt",
      ]),
      // computed fields
      ...stateFlagsAttributes,
      // associations
      user: UsersSerializer.asDetailed(this.traveller),
      stops: this.record.stops?.map(StopsSerializer.asDetailed) || [],
    }
  }

  private get traveller(): User {
    if (isNil(this.record.user)) {
      throw new Error("TravelAuthorization must include an associated User")
    }

    return this.record.user
  }
}

export default ShowSerializer
