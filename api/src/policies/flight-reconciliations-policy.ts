import { Attributes, FindOptions } from "sequelize"

import { Path } from "@/utils/deep-pick"
import { User, FlightReconciliation } from "@/models"
import { allRecordsScope, noRecordsScope } from "@/policies/base-policy"
import PolicyFactory from "@/policies/policy-factory"

export class FlightReconciliationsPolicy extends PolicyFactory(FlightReconciliation) {
  show(): boolean {
    if (this.user.isTravelDeskUser || this.user.isAdmin) return true

    return false
  }

  create(): boolean {
    if (this.user.isTravelDeskUser || this.user.isAdmin) return true

    return false
  }

  update(): boolean {
    if (this.user.isTravelDeskUser || this.user.isAdmin) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isTravelDeskUser || this.user.isAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    return ["reconciled", "reconcilePeriod"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["externalTravComIdentifier", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<FlightReconciliation>> {
    if (user.isTravelDeskUser || user.isAdmin) {
      return allRecordsScope
    }

    return noRecordsScope
  }
}

export default FlightReconciliationsPolicy
