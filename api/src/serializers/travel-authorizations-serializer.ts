import { isNil, last, first, pick } from "lodash"

import { Stop, TravelAuthorization } from "@/models"

import BaseSerializer from "./base-serializer"

export class TravelAuthorizationsSerializer extends BaseSerializer<TravelAuthorization> {
  static asTable(travelAuthorizations: TravelAuthorization[]) {
    return travelAuthorizations.map((travelAuthorization) => {
      const serializer = new this(travelAuthorization)
      return serializer.asTableRow()
    })
  }

  private firstStop: Stop | undefined
  private lastStop: Stop | undefined

  constructor(record: TravelAuthorization) {
    super(record)
    this.firstStop = first(this.record.stops)
    this.lastStop = last(this.record.stops)
  }

  asTableRow() {
    return {
      ...pick(this.record, ["id", "status", "eventName"]),
      finalDestination: this.lastStop?.location,
      departingAt: this.firstStop?.departureAt,
      returningAt: this.lastStop?.departureAt,
      phase: this.determinePhase(),
    }
  }

  determinePhase() {
    if (this.isDraft()) {
      return "travel_approval"
    } else if (this.hasCreatedTravelDeskRequest() && !this.isTravelling()) {
      return "travel_planning"
    } else if (this.isTravelling()) {
      return "travelling"
    }
  }

  isDraft() {
    return this.record.status === TravelAuthorization.Statuses.DRAFT
  }

  hasCreatedTravelDeskRequest() {
    return this.record.travelDeskTravelRequest !== null
  }

  isTravelling() {
    const currentDate = new Date()

    if (
      isNil(this.firstStop) ||
      isNil(this.lastStop) ||
      isNil(this.firstStop.departureAt) ||
      isNil(this.lastStop.departureAt)
    ) {
      return false
    }

    if (this.firstStop.departureAt <= currentDate && currentDate <= this.lastStop.departureAt) {
      return true
    }

    return false
  }
}

export default TravelAuthorizationsSerializer
