import { isUndefined } from "lodash"

import { Path } from "@/utils/deep-pick"
import { TravelAuthorization, TravelDeskTravelRequest } from "@/models"
import BasePolicy from "@/policies/base-policy"
import TravelDeskTravelRequestsPolicy from "@/policies/travel-desk-travel-requests-policy"

export class BookPolicy extends BasePolicy<TravelDeskTravelRequest> {
  create(): boolean {
    if (this.user.isAdmin) return true
    if (this.user.isTravelDeskUser) return true
    if (this.travelAuthorization.supervisorEmail === this.user.email) return true

    return false
  }

  permittedAttributes(): Path[] {
    return this.travelDeskTravelRequestsPolicy.permittedAttributes()
  }

  private get travelDeskTravelRequestsPolicy(): TravelDeskTravelRequestsPolicy {
    return new TravelDeskTravelRequestsPolicy(this.user, this.record)
  }

  private get travelAuthorization(): TravelAuthorization {
    const { travelAuthorization } = this.record
    if (isUndefined(travelAuthorization)) {
      throw new Error("Travel Authorization is required")
    }

    return travelAuthorization
  }
}

export default BookPolicy
