import { isEmpty, isNil, last, first, pick } from "lodash"

import { Expense, Stop, TravelAuthorization, TravelDeskPassengerNameRecordDocument } from "@/models"

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
      action: this.determineAction(),
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

  /*
  Options
    Submit Travel Desk Request
    Forms.status is Approved and
    If any travel_authorizations -> travel_authorizations.id -> stops.travel_authorization_id -> stops (any) -> stops.transport is of type Aircraft
    Submit Expense Claim
    Beyond travel end date.
    After travel_authorizations -> travel_authorizations.id -> stops.travel_authorization_id -> stops (last) -> stops.departure_date
    View Itinerary
    Where the Travel desk request is complete. Request has a PNR number.
    When travel_authorizations -> travel_authorizations.id -> travel_desk_travel_requests.travel_authorization_id -> travel_desk_travel_requests (exists) -> travel_desk_travel_requests.id -> travel_desk_passenger_name_record_documents.travel_desk_travel_request_id -> travel_desk_passenger_name_record_documents (exists) -> travel_desk_passenger_name_record_documents.pnr_document (is not null)
    Add Expense
    Available once travel approved.
    travel_authorizations.status is Approved
    Submit Pool Vehicle Request
    Where travel auth form = approved and transport type =pool vehicle.
    Forms.status is Approved
    If any travel_authorizations -> travel_authorizations.id -> stops.travel_authorization_id -> stops (any) -> stops.transport is of type Pool Vehicle
    no action/blank
    travel_authorizations.status
    TODO: where waiting on action from other party eg. approval or travel desk options returned.
  */
  determineAction() {
    /*
      Approved
      Awaiting Director Approval
      Draft
      Expense Claim
      Booked
      Travelling
      Approved

      submit_travel_desk_request
      submit_expense_claim
      view_itinerary
      add_expense
      submit_pool_vehicle_request
    */
    if (this.isApproved() && this.anyTransportTypeIsAircraft()) {
      return ["submit_travel_desk_request"]
    } else if (this.travellingComplete()) {
      return ["submit_expense_claim"]
    } else if (this.travelDeskRequestIsComplete()) {
      return ["view_itinerary"]
      // TODO: more stuff.
    } else {
      return []
    }
  }

  isDraft() {
    return this.record.status === TravelAuthorization.Statuses.DRAFT
  }

  isExpensed() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSED
  }

  isApproved() {
    return this.record.status === TravelAuthorization.Statuses.APPROVED
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

  anyTransportTypeIsAircraft() {
    return this.record.stops?.some((stop) => stop.transport === Stop.TravelMethods.AIRCRAFT)
  }

  // Optimization to avoid loading the prnDocument into memory,
  // Using special query that only returns a travelDeskPassengerNameRecordDocument if the prnDocument exists
  travelDeskRequestIsComplete() {
    return !isNil(this.record.travelDeskTravelRequest?.travelDeskPassengerNameRecordDocument?.id)
  }
}

export default TravelAuthorizationsSerializer
