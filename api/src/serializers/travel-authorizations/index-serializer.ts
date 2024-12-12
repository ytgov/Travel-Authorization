import { isEmpty, isNil, last, first, pick } from "lodash"

import {
  Expense,
  Stop,
  TravelAuthorization,
  TravelDeskTravelRequest,
  TravelSegment,
  User,
} from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type TravelAuthorizationIndexView = Pick<TravelAuthorization, "id" | "eventName"> & {
  // computed fields
  finalDestination: string | undefined
  departingAt: string | undefined
  returningAt: string | undefined
  phase: string
  status: string
  action: string
  firstName: string
  lastName: string
  department: string
  branch: string
  // state flags
  isDraft: boolean
  isDeleted: boolean
  isSubmitted: boolean
  isApproved: boolean
  isDenied: boolean
  isChangeRequested: boolean
  isBooked: boolean
  isExpenseClaimSubmitted: boolean
  isExpenseClaimApproved: boolean
  isExpenseClaimDenied: boolean
  isExpensed: boolean
  isTravelDeskDraft: boolean
  isTravelDeskSubmitted: boolean
  isTravelDeskOptionsProvided: boolean
  isTravelDeskOptionsRanked: boolean
  isTravelDeskBooked: boolean
  isTravelDeskComplete: boolean
  isInFinalState: boolean
  isInTravelDeskFlow: boolean
} & {
  // associations
  travelDeskTravelRequest: TravelDeskTravelRequest
}

export class IndexSerializer extends BaseSerializer<TravelAuthorization> {
  constructor(
    protected record: TravelAuthorization,
    protected currentUser: User
  ) {
    super(record)
  }

  perform() {
    return {
      ...pick(this.record, ["id", "eventName", "status", "createdAt", "updatedAt"]),
      // computed fields
      finalDestination: this.lastStop?.location,
      departingAt: this.firstStop?.departureAt,
      returningAt: this.lastStop?.departureAt,
      phase: this.determinePhase(),
      action: this.determineAction(),
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      department: this.user.department,
      branch: this.user.branch,
      isTraveling: this.isTravelling(),
      // state flags
      isDraft: this.isDraft(),
      isDeleted: this.isDeleted(),
      isSubmitted: this.isSubmitted(),
      isApproved: this.isApproved(),
      isDenied: this.isDenied(),
      isChangeRequested: this.isChangeRequested(),
      isBooked: this.isBooked(),
      isExpenseClaimSubmitted: this.isExpenseClaimSubmitted(),
      isExpenseClaimApproved: this.isExpenseClaimApproved(),
      isExpenseClaimDenied: this.isExpenseClaimDenied(),
      isExpensed: this.isExpensed(),
      isTravelDeskDraft: this.isTravelDeskDraft(),
      isTravelDeskSubmitted: this.isTravelDeskSubmitted(),
      isTravelDeskOptionsProvided: this.isTravelDeskOptionsProvided(),
      isTravelDeskOptionsRanked: this.isTravelDeskOptionsRanked(),
      isTravelDeskBooked: this.isTravelDeskBooked(),
      isTravelDeskComplete: this.isTravelDeskComplete(),
      isInFinalState: this.isInFinalState(),
      isInTravelDeskFlow: this.isInTravelDeskFlow(),
      // associations
      travelDeskTravelRequest: this.record.travelDeskTravelRequest,
    }
  }

  // TODO: double check the order of these conditions
  determinePhase() {
    if (this.isDraft() || this.awaitingApproval()) {
      return "travel_approval"
    } else if (this.beforeTravelling() && (this.isApproved() || this.isBooked())) {
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

  // TODO: double check the order of these conditions
  determineAction() {
    if (this.isDraft()) {
      return ["delete"]
    } else if (
      this.isApproved() &&
      this.anyTransportTypeIsAircraft() &&
      !this.travelDeskRequestIsSubmitted() &&
      !this.travelDeskRequestIsOptionsProvided() &&
      !this.travelDeskRequestIsOptionsRanked()
    ) {
      return ["submit_travel_desk_request"]
    } else if (
      this.isApproved() &&
      this.anyTransportTypeIsAircraft() &&
      this.travelDeskRequestIsOptionsProvided()
    ) {
      return ["travel_desk_options_provided"]
    } else if (this.isApproved() && this.travellingComplete()) {
      return ["submit_expense_claim"]
    } else if (this.travelDeskRequestIsComplete()) {
      return ["view_itinerary"]
    } else if (this.isApproved() && this.isTravelling()) {
      return ["add_expense"]
    } else if (this.isApproved() && this.anyTransportTypeIsPoolVehicle()) {
      return ["submit_pool_vehicle_request"]
    } else {
      return []
    }
  }

  isBooked() {
    return this.record.status === TravelAuthorization.Statuses.BOOKED
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

  awaitingApproval() {
    return this.record.status === TravelAuthorization.Statuses.SUBMITTED
  }

  beforeTravelling() {
    if (isNil(this.firstStop) || isNil(this.firstStop.departureAt)) {
      return false
    }

    if (this.currentDate < this.firstStop.departureAt) {
      return true
    }

    return false
  }

  isTravelling() {
    if (!this.isApproved()) return false
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
    if (isNil(this.lastTravelSegment) || isNil(this.lastTravelSegment.departureAt)) {
      return this.legacyTravellingComplete() // Replace with false when Stop model is removed
    }

    if (this.currentDate > this.lastTravelSegment.departureAt) {
      return true
    }

    return false
  }

  legacyTravellingComplete() {
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

  anyTransportTypeIsPoolVehicle() {
    return this.record.stops?.some((stop) => stop.transport === Stop.TravelMethods.POOL_VEHICLE)
  }

  travelDeskRequestIsSubmitted() {
    return (
      this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.SUBMITTED
    )
  }

  travelDeskRequestIsOptionsProvided() {
    return (
      this.record.travelDeskTravelRequest?.status ===
      TravelDeskTravelRequest.Statuses.OPTIONS_PROVIDED
    )
  }

  travelDeskRequestIsOptionsRanked() {
    return (
      this.record.travelDeskTravelRequest?.status ===
      TravelDeskTravelRequest.Statuses.OPTIONS_RANKED
    )
  }

  travelDeskRequestIsComplete() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.BOOKED
  }

  isDeleted() {
    return this.record.status === TravelAuthorization.Statuses.DELETED
  }

  isSubmitted() {
    return this.record.status === TravelAuthorization.Statuses.SUBMITTED
  }

  isDenied() {
    return this.record.status === TravelAuthorization.Statuses.DENIED
  }

  isChangeRequested() {
    return this.record.status === TravelAuthorization.Statuses.CHANGE_REQUESTED
  }

  isExpenseClaimSubmitted() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_SUBMITTED
  }

  isExpenseClaimApproved() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_APPROVED
  }

  isExpenseClaimDenied() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_DENIED
  }

  isTravelDeskDraft() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.DRAFT
  }

  isTravelDeskSubmitted() {
    return (
      this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.SUBMITTED
    )
  }

  isTravelDeskOptionsProvided() {
    return (
      this.record.travelDeskTravelRequest?.status ===
      TravelDeskTravelRequest.Statuses.OPTIONS_PROVIDED
    )
  }

  isTravelDeskOptionsRanked() {
    return (
      this.record.travelDeskTravelRequest?.status ===
      TravelDeskTravelRequest.Statuses.OPTIONS_RANKED
    )
  }

  isTravelDeskBooked() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.BOOKED
  }

  isTravelDeskComplete() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.COMPLETE
  }

  isInFinalState() {
    return this.isDeleted() || this.isDenied() || this.isExpenseClaimDenied() || this.isExpensed()
  }

  isInTravelDeskFlow() {
    return (
      this.isTravelDeskDraft() ||
      this.isTravelDeskSubmitted() ||
      this.isTravelDeskOptionsProvided() ||
      this.isTravelDeskOptionsRanked() ||
      this.isTravelDeskBooked() ||
      this.isTravelDeskComplete()
    )
  }

  get firstStop(): Stop | undefined {
    return first(this.record.stops)
  }

  get lastStop(): Stop | undefined {
    return last(this.record.stops)
  }

  get lastTravelSegment(): TravelSegment | undefined {
    return last(this.record.travelSegments)
  }

  get currentDate(): Date {
    return new Date()
  }

  get user(): User {
    if (isNil(this.record.user)) {
      throw new Error("TravelAuthorization must include an associated User")
    }

    return this.record.user
  }
}

export default IndexSerializer
