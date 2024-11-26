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
    if (this.record.userId === this.user.id) return true

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
    if (
      this.record.status === TravelAuthorization.Statuses.DRAFT ||
      this.user.roles.includes(User.Roles.ADMIN) ||
      this.record.supervisorEmail === this.user.email
    ) {
      return [
        "preApprovalProfileId",
        "purposeId",
        "stepNumber",
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
        // Note that these nested attributes are "create" attributes, not "update" attributes
        // as a full replace is occuring.
        {
          stops: [
            "travelAuthorizationId",
            "locationId",
            "departureDate",
            "departureTime",
            "transport",
            "accommodationType",
          ],
        },
        {
          expenses: [
            "travelAuthorizationId",
            "type",
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
            "travelAuthorizationId",
            "type",
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

    return ["stepNumber"]
  }

  permittedAttributesForCreate(): Path[] {
    const permittedAttributes = [
      ...this.permittedAttributes(),
      "slug",
      // TODO: use permitedAttributes from relevant policies once they exist
      {
        stopsAttributes: [
          "travelAuthorizationId",
          "locationId",
          "departureDate",
          "departureTime",
          "transport",
          "accommodationType",
        ],
        expensesAttributes: [
          "travelAuthorizationId",
          "type",
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
