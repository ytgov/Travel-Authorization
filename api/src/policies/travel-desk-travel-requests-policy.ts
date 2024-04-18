import { ModelStatic, Op } from "sequelize"
import { isNil, isUndefined } from "lodash"

import BasePolicy from "./base-policy"

import { User, TravelDeskTravelRequest } from "@/models"
import TravelAuthorizationsPolicy from "@/policies/travel-authorizations-policy"

export class TravelDeskTravelRequestsPolicy extends BasePolicy<TravelDeskTravelRequest> {
  show(): boolean {
    return this.travelAuthorizationsPolicy.show()
  }

  static applyScope(
    modelClass: ModelStatic<TravelDeskTravelRequest>,
    currentUser: User
  ): ModelStatic<TravelDeskTravelRequest> {
    if (currentUser.roles.includes(User.Roles.ADMIN)) {
      return modelClass
    }

    return modelClass.scope({
      // @ts-expect-error - Bad types in sequelize, all FindOptions are valid.
      include: [
        {
          association: "travelAuthorization",
          where: {
            [Op.or]: [
              {
                supervisorEmail: currentUser.email,
              },
              { userId: currentUser.id },
            ],
          },
        },
      ],
    })
  }

  private get travelAuthorizationsPolicy(): TravelAuthorizationsPolicy {
    const { travelAuthorization } = this.record
    if (isUndefined(travelAuthorization)) {
      throw new Error("Travel Authorization is required")
    }

    return new TravelAuthorizationsPolicy(this.user, travelAuthorization)
  }
}

export default TravelDeskTravelRequestsPolicy
