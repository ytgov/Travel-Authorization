import { Attributes, FindOptions } from "sequelize"

import { Path } from "@/utils/deep-pick"
import { User, TravelDeskFlightOption, TravelDeskFlightSegment } from "@/models"
import { allRecordsScope, noRecordsScope } from "@/policies/base-policy"
import PolicyFactory from "@/policies/policy-factory"
import TravelDeskFlightSegmentsPolicy from "@/policies/travel-desk-flight-segments-policy"

export class TravelDeskFlightOptionsPolicy extends PolicyFactory(TravelDeskFlightOption) {
  // TODO: add ability for traveller to create/read/update/delete their own data
  // Might need to add travelerId to a bunch of models?
  show(): boolean {
    return this.user.isTravelDeskUser || this.user.isAdmin
  }

  create(): boolean {
    return this.user.isTravelDeskUser || this.user.isAdmin
  }

  update(): boolean {
    return this.user.isTravelDeskUser || this.user.isAdmin
  }

  destroy(): boolean {
    return this.user.isTravelDeskUser || this.user.isAdmin
  }

  permittedAttributes(): Path[] {
    return ["flightRequestId", "cost", "flightPreferenceOrder", "leg", "duration"]
  }

  permittedAttributesForCreate(): Path[] {
    return [
      "travelerId",
      ...this.permittedAttributes(),
      {
        flightSegmentsAttributes:
          this.travelDeskFlightSegmentsPolicy.permittedAttributesForCreate(),
      },
    ]
  }

  static policyScope(user: User): FindOptions<Attributes<TravelDeskFlightOption>> {
    if (user.isTravelDeskUser || user.isAdmin) {
      return allRecordsScope
    }

    return noRecordsScope
  }

  private get travelDeskFlightSegmentsPolicy() {
    const travelDeskFlightSegment = TravelDeskFlightSegment.build()
    return new TravelDeskFlightSegmentsPolicy(this.user, travelDeskFlightSegment)
  }
}

export default TravelDeskFlightOptionsPolicy
