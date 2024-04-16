import { ModelStatic, WhereOptions, literal } from "sequelize"
import { isNil } from "lodash"

import { TravelAuthorizationPreApprovalProfile, User } from "@/models"

import BasePolicy from "@/policies/base-policy"

export class TravelAuthorizationPreApprovalProfilesPolicy extends BasePolicy<TravelAuthorizationPreApprovalProfile> {
  static applyScope(
    modelClass: ModelStatic<TravelAuthorizationPreApprovalProfile>,
    currentUser: User
  ): ModelStatic<TravelAuthorizationPreApprovalProfile> {
    if (currentUser.roles.includes(User.Roles.ADMIN)) {
      return modelClass
    }

    if (isNil(currentUser.department)) {
      const never = literal("1=0")
      return modelClass.scope({ where: never })
    }

    const where: WhereOptions<TravelAuthorizationPreApprovalProfile> = {
      department: currentUser.department,
    }

    return modelClass.scope({ where })
  }
}

export default TravelAuthorizationPreApprovalProfilesPolicy
