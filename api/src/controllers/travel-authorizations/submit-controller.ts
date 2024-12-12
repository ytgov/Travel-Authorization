import { isNil } from "lodash"

import { BaseController } from "@/controllers/base-controller"
import { TravelAuthorization } from "@/models"
import { SubmitService } from "@/services/travel-authorizations"
import { SubmitPolicy } from "@/policies/travel-authorizations"
import { ShowSerializer } from "@/serializers/travel-authorizations"

// Submission is basically an enhanced TravelAuthorizationsController#update
// that also changes the status to "submitted".
export class SubmitController extends BaseController {
  async create() {
    if (isNil(this.params.travelAuthorizationId)) {
      return this.response.status(404).json({ message: "Missing travel authorization id param." })
    }

    const travelAuthorization = await this.loadTravelAuthorization()
    if (isNil(travelAuthorization)) {
      return this.response.status(404).json({ message: "Travel authorization not found." })
    }

    const policy = this.buildPolicy(travelAuthorization)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to submit this travel authorization." })
    }

    const permittedAttributes = policy.permitAttributesForUpdate(this.request.body)
    return SubmitService.perform(travelAuthorization, permittedAttributes, this.currentUser)
      .then((travelAuthorization) => {
        const serializedTravelAuthorization = ShowSerializer.perform(
          travelAuthorization,
          this.currentUser
        )

        return this.response
          .status(200)
          .json({ travelAuthorization: serializedTravelAuthorization })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `Travel authorization submission failed: ${error}` })
      })
  }

  private loadTravelAuthorization(): Promise<TravelAuthorization | null> {
    return TravelAuthorization.findByPk(this.params.travelAuthorizationId)
  }

  private buildPolicy(record: TravelAuthorization): SubmitPolicy {
    return new SubmitPolicy(this.currentUser, record)
  }
}

export default SubmitController
