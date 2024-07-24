import { ModelStatic, Op, WhereOptions } from "sequelize"

import { Path } from "@/utils/deep-pick"
import { User, TravelAuthorization } from "@/models"
import UsersPolicy from "@/policies/users-policy"
import BasePolicy from "@/policies/base-policy"

export class TravelAuthorizationsPolicy extends BasePolicy<TravelAuthorization> {
  create(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
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

  // Currently the same as the update policy, but this is likely to change in the future
  // so opted for duplication over premature abstraction.
  destroy(): boolean {
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

  // NOTE: userId is always restricted after creation.
  permittedAttributes(): Path[] {
    return [
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
      "supervisorEmail",
      "approved",
      "requestChange",
      "denialReason",
      "oneWayTrip",
      "multiStop",
      "travelAdvanceInCents",
      "allTravelWithinTerritory",

      // TODO: use permitedAttributes from relevant policies once they exist
      {
        stops: ["locationId", "departureDate", "departureTime", "transport", "accommodationType"],
      },
      {
        expenses: [
          "expenseType",
          "description",
          "date",
          "cost",
          "currency",
          "receiptImage",
          "fileName",
        ],
      },
      {
        estimates: [
          "expenseType",
          "description",
          "date",
          "cost",
          "currency",
          "receiptImage",
          "fileName",
        ],
      },
    ]
  }

  permittedAttributesForCreate(): Path[] {
    const permittedAttributes = [
      ...this.permittedAttributes(),
      "slug",
      // TODO: use permitedAttributes from relevant policies once they exist
      {
        stopsAttributes: [
          "locationId",
          "departureDate",
          "departureTime",
          "transport",
          "accommodationType",
        ],
      },
    ]

    if (this.user.roles.includes(User.Roles.ADMIN)) {
      permittedAttributes.push("userId", {
        userAttributes: this.userPolicy.permittedAttributesForCreate(),
      })
    }

    return permittedAttributes
  }

  private get userPolicy(): UsersPolicy {
    return new UsersPolicy(this.user, User.build())
  }
}

export default TravelAuthorizationsPolicy
