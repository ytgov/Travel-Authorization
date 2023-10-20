import { isEmpty, isNil, last, first, pick } from "lodash"

import { Expense, Stop, TravelAuthorization } from "@/models"

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
  private currentDate: Date

  constructor(record: TravelAuthorization) {
    super(record)
    this.firstStop = first(this.record.stops)
    this.lastStop = last(this.record.stops)
    this.currentDate = new Date()
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
    } else if (this.travellingComplete()) {
      return "travel_complete"
    } else if (this.hasExpenses()) {
      return "expensing"
    } else if (this.isExpensed()) {
      return "expensed"
    } else {
      return undefined
    }
  }

  isDraft() {
    return this.record.status === TravelAuthorization.Statuses.DRAFT
  }

  isExpensed() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSED
  }

  hasCreatedTravelDeskRequest() {
    return this.record.travelDeskTravelRequest !== null
  }

  isTravelling() {
    if (
      isNil(this.firstStop) ||
      isNil(this.lastStop) ||
      isNil(this.firstStop.departureAt) ||
      isNil(this.lastStop.departureAt)
    ) {
      return false
    }

    if (
      this.firstStop.departureAt <= this.currentDate &&
      this.currentDate <= this.lastStop.departureAt
    ) {
      return true
    }

    return false
  }

  travellingComplete() {
    if (isNil(this.lastStop) || isNil(this.lastStop.departureAt)) {
      return false
    }

    if (this.currentDate > this.lastStop.departureAt) {
      return true
    }

    return false
  }

  hasExpenses() {
    const expenses = this.record.expenses?.filter(
      (expense) => expense.type === Expense.Types.EXPENSE
    )
    return !isEmpty(expenses)
  }
}

export default TravelAuthorizationsSerializer
