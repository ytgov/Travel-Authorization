import { isNil } from "lodash"

import { TravelDeskFlightOption, User } from "@/models"
import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskFlightOption>

export class CreateService extends BaseService {
  constructor(
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskFlightOption> {
    const {
      flightRequestId,
      travelerId,
      cost,
      leg,
      duration,
      flightPreferenceOrder,
      ...optionalAttributes
    } = this.attributes

    if (isNil(flightRequestId)) {
      throw new Error("Flight request ID is required.")
    }

    if (isNil(travelerId)) {
      throw new Error("Traveler ID is required.")
    }

    if (isNil(cost)) {
      throw new Error("Cost is required.")
    }

    if (isNil(leg)) {
      throw new Error("Leg is required.")
    }

    if (isNil(duration)) {
      throw new Error("Duration is required.")
    }

    return TravelDeskFlightOption.create({
      ...optionalAttributes,
      flightRequestId,
      travelerId,
      cost,
      leg,
      duration,
    })
  }
}

export default CreateService
