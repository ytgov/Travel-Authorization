import { ModelStatic, Op, WhereOptions } from "sequelize"

import BasePolicy from "./base-policy"

import { User, TravelAuthorization } from "@/models"

export class TravelAuthorizationsPolicy extends BasePolicy<TravelAuthorization> {
  create(): boolean {
    if (this.record.userId === this.user.id) return true

    return false
  }

  show(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.supervisorEmail === this.user.email) return true
    if (this.record.userId === this.user.id) return true

    return false
  }

  update(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.supervisorEmail === this.user.email) return true
    if (
      this.record.userId === this.user.id &&
      this.record.status === TravelAuthorization.Statuses.DRAFT
    ) {
      return true
    }

    return false
  }

  static applyScope(
    modelClass: ModelStatic<TravelAuthorization>,
    currentUser: User
  ): ModelStatic<TravelAuthorization> {
    if (currentUser.roles.includes(User.Roles.ADMIN)) {
      return modelClass
    }

    const where: WhereOptions<TravelAuthorization> = {
      [Op.or]: [
        {
          supervisorEmail: currentUser.email,
        },
        { userId: currentUser.id },
      ],
    }

    return modelClass.scope({ where })
  }

  permittedAttributes(): string[] {
    return [
      "userId",
      "preappId",
      "purposeId",
      "status", // Permit status changes until we have a state management system.
      "firstName", // all this user information should probably be restricted?
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
      "supervisorEmail",
      "approved",
      "requestChange",
      "denialReason",
      "oneWayTrip",
      "multiStop",
      "travelAdvanceInCents",
      "allTravelWithinTerritory",

      // TODO: limit these using the appropriate policy
      // association attributes
      "stops",
      "expenses",
      "estimates",
    ]
  }

  permittedAttributesForCreate() {
    return ["slug", ...this.permittedAttributes()]
  }
}

export default TravelAuthorizationsPolicy
