import { ModelStatic, Op, WhereOptions } from "sequelize"

import { TravelAuthorizationPreApproval, User } from "@/models"

import BasePolicy from "@/policies/base-policy"

export class TravelAuthorizationPreApprovalsPolicy extends BasePolicy<TravelAuthorizationPreApproval> {
  static applyScope(
    modelClass: ModelStatic<TravelAuthorizationPreApproval>,
    currentUser: User
  ): ModelStatic<TravelAuthorizationPreApproval> {
    if (currentUser.roles.includes(User.Roles.ADMIN)) {
      return modelClass
    }

    const where: WhereOptions<TravelAuthorizationPreApproval> = {
      department: currentUser.department,
    }

    return modelClass.scope({ where })
  }
}

export default TravelAuthorizationPreApprovalsPolicy
