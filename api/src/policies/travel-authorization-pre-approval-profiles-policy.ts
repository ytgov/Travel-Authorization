import { Attributes, FindOptions } from "sequelize"
import { isNil } from "lodash"

import { TravelAuthorizationPreApprovalProfile, User } from "@/models"

import PolicyFactory from "@/policies/policy-factory"
import { allRecordsScope, noRecordsScope } from "@/policies/base-policy"

export class TravelAuthorizationPreApprovalProfilesPolicy extends PolicyFactory(
  TravelAuthorizationPreApprovalProfile
) {
  static policyScope(user: User): FindOptions<Attributes<TravelAuthorizationPreApprovalProfile>> {
    if (user.roles.includes(User.Roles.ADMIN)) {
      return allRecordsScope
    }

    if (isNil(user.department)) {
      return noRecordsScope
    }

    return {
      where: {
        department: user.department,
      },
    }
  }
}

export default TravelAuthorizationPreApprovalProfilesPolicy
