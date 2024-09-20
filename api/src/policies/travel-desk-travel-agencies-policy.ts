import { Attributes, FindOptions, literal } from "sequelize"

import { Path } from "@/utils/deep-pick"
import { TravelDeskTravelAgency, User } from "@/models"
import PolicyFactory from "@/policies/policy-factory"

export class TravelDeskTravelAgenciesPolicy extends PolicyFactory(TravelDeskTravelAgency) {
  show(): boolean {
    return false
  }

  create(): boolean {
    return false
  }

  update(): boolean {
    return false
  }

  destroy(): boolean {
    return false
  }

  permittedAttributes(): Path[] {
    return ["agencyName", "agencyInfo"]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<TravelDeskTravelAgency>> {
    return {
      where: literal("1 = 0"),
    }
  }
}

export default TravelDeskTravelAgenciesPolicy
