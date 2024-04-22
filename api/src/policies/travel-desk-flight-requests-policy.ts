import { ModelStatic, Op } from "sequelize"

import { User, TravelDeskFlightRequest } from "@/models"

import BasePolicy from "@/policies/base-policy"

export class TravelDeskFlightRequestsPolicy extends BasePolicy<TravelDeskFlightRequest> {
  static applyScope(
    modelClass: ModelStatic<TravelDeskFlightRequest>,
    currentUser: User
  ): ModelStatic<TravelDeskFlightRequest> {
    if (currentUser.roles.includes(User.Roles.ADMIN)) {
      return modelClass
    }

    return modelClass.scope({
      // @ts-expect-error - Bad types in sequelize, all FindOptions are valid.
      include: [
        {
          association: "travelRequest",
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
        },
      ],
    })
  }
}

export default TravelDeskFlightRequestsPolicy
