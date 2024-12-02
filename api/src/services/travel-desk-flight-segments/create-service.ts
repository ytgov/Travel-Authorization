import { isNil } from "lodash"

import { TravelDeskFlightSegment, User } from "@/models"
import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskFlightSegment>

export class CreateService extends BaseService {
  constructor(
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskFlightSegment> {
    const {
      flightOptionId,
      flightNumber,
      departAt,
      departLocation,
      arriveAt,
      arriveLocation,
      duration,
      status,
      class: klass,
      ...optionalAttributes
    } = this.attributes

    if (isNil(flightOptionId)) {
      throw new Error("Flight option ID is required.")
    }

    if (isNil(flightNumber)) {
      throw new Error("Flight number is required.")
    }

    if (isNil(departAt)) {
      throw new Error("Depart at is required.")
    }

    if (isNil(departLocation)) {
      throw new Error("Depart location is required.")
    }

    if (isNil(arriveAt)) {
      throw new Error("Arrive at is required.")
    }

    if (isNil(arriveLocation)) {
      throw new Error("Arrive location is required.")
    }

    if (isNil(duration)) {
      throw new Error("Duration is required.")
    }

    if (isNil(status)) {
      throw new Error("Status is required.")
    }

    if (isNil(klass)) {
      throw new Error("Class is required.")
    }

    return TravelDeskFlightSegment.create({
      ...optionalAttributes,
      flightOptionId,
      flightNumber,
      departAt,
      departLocation,
      arriveAt,
      arriveLocation,
      duration,
      status,
      class: klass,
    })
  }
}

export default CreateService
