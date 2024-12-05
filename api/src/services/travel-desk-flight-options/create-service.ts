import { CreationAttributes } from "sequelize"
import { isNil } from "lodash"

import db, { TravelDeskFlightOption, User, TravelDeskFlightSegment } from "@/models"
import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskFlightOption> & {
  flightSegmentsAttributes?: Partial<TravelDeskFlightSegment>[]
}

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
      flightSegmentsAttributes,
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

    return db.transaction(async () => {
      const travelDeskFlightOption = await TravelDeskFlightOption.create({
        ...optionalAttributes,
        flightRequestId,
        travelerId,
        cost,
        leg,
        duration,
      })

      await this.bulkCreateTravelDeskFlightSegments(
        travelDeskFlightOption.id,
        flightSegmentsAttributes
      )

      return travelDeskFlightOption
    })
  }

  private async bulkCreateTravelDeskFlightSegments(
    travelDeskFlightOptionId: number,
    flightSegmentsAttributes: Partial<TravelDeskFlightSegment>[] = []
  ): Promise<void> {
    const safeFlightSegmentsAttributes: CreationAttributes<TravelDeskFlightSegment>[] = []
    for (const {
      duration,
      departLocation,
      arriveLocation,
      status,
      flightNumber,
      departAt,
      arriveAt,
      class: klass,
      ...optionalAttributes
    } of flightSegmentsAttributes) {
      if (isNil(duration)) {
        throw new Error("Duration is required.")
      }

      if (isNil(departLocation)) {
        throw new Error("Depart location is required.")
      }

      if (isNil(arriveLocation)) {
        throw new Error("Arrive location is required.")
      }

      if (isNil(status)) {
        throw new Error("Status is required.")
      }

      if (isNil(flightNumber)) {
        throw new Error("Flight number is required.")
      }

      if (isNil(departAt)) {
        throw new Error("Depart at is required.")
      }

      if (isNil(arriveAt)) {
        throw new Error("Arrive at is required.")
      }

      if (isNil(klass)) {
        throw new Error("Class is required.")
      }

      safeFlightSegmentsAttributes.push({
        ...optionalAttributes,
        duration,
        departLocation,
        arriveLocation,
        status,
        flightNumber,
        departAt,
        arriveAt,
        class: klass,
        flightOptionId: travelDeskFlightOptionId,
      })
    }

    await TravelDeskFlightSegment.bulkCreate(safeFlightSegmentsAttributes)
  }
}

export default CreateService
