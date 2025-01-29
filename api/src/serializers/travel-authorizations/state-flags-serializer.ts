import { isNil } from "lodash"

import { TravelAuthorization, TravelDeskTravelRequest, TravelSegment, User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type TravelAuthorizationStateFlagsView = {
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
  // Travel Desk states
  isTravelDeskDraft: boolean
  isTravelDeskSubmitted: boolean
  isTravelDeskOptionsProvided: boolean
  isTravelDeskOptionsRanked: boolean
  isTravelDeskBooked: boolean
  isTravelDeskComplete: boolean
  // Composite states
  isTravellingByAir: boolean
  isInFinalState: boolean
  isInTravelDeskFlow: boolean
}

export class StateFlagsSerializer extends BaseSerializer<TravelAuthorization> {
  constructor(
    protected record: TravelAuthorization,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): TravelAuthorizationStateFlagsView {
    return {
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
      // Travel Desk states
      isTravelDeskDraft: this.isTravelDeskDraft(),
      isTravelDeskSubmitted: this.isTravelDeskSubmitted(),
      isTravelDeskOptionsProvided: this.isTravelDeskOptionsProvided(),
      isTravelDeskOptionsRanked: this.isTravelDeskOptionsRanked(),
      isTravelDeskBooked: this.isTravelDeskBooked(),
      isTravelDeskComplete: this.isTravelDeskComplete(),

      // Composite states
      isTravellingByAir: this.isTravellingByAir(),
      isInFinalState: this.isInFinalState(),
      isInTravelDeskFlow: this.isInTravelDeskFlow(),
    }
  }

  // State flags
  private isDraft() {
    return this.record.status === TravelAuthorization.Statuses.DRAFT
  }

  private isDeleted() {
    return this.record.status === TravelAuthorization.Statuses.DELETED
  }

  private isSubmitted() {
    return this.record.status === TravelAuthorization.Statuses.SUBMITTED
  }

  private isApproved() {
    return this.record.status === TravelAuthorization.Statuses.APPROVED
  }

  private isDenied() {
    return this.record.status === TravelAuthorization.Statuses.DENIED
  }

  private isChangeRequested() {
    return this.record.status === TravelAuthorization.Statuses.CHANGE_REQUESTED
  }

  private isBooked() {
    return this.record.status === TravelAuthorization.Statuses.BOOKED
  }

  private isExpenseClaimSubmitted() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_SUBMITTED
  }

  private isExpenseClaimApproved() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_APPROVED
  }

  private isExpenseClaimDenied() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSE_CLAIM_DENIED
  }

  private isExpensed() {
    return this.record.status === TravelAuthorization.Statuses.EXPENSED
  }

  // Travel Desk Request States
  private isTravelDeskDraft() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.DRAFT
  }

  private isTravelDeskSubmitted() {
    return (
      this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.SUBMITTED
    )
  }

  private isTravelDeskOptionsProvided() {
    return (
      this.record.travelDeskTravelRequest?.status ===
      TravelDeskTravelRequest.Statuses.OPTIONS_PROVIDED
    )
  }

  private isTravelDeskOptionsRanked() {
    return (
      this.record.travelDeskTravelRequest?.status ===
      TravelDeskTravelRequest.Statuses.OPTIONS_RANKED
    )
  }

  private isTravelDeskBooked() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.BOOKED
  }

  private isTravelDeskComplete() {
    return this.record.travelDeskTravelRequest?.status === TravelDeskTravelRequest.Statuses.COMPLETE
  }

  // Composite States
  private isTravellingByAir() {
    if (isNil(this.record.travelSegments)) {
      return false
    }

    return this.record.travelSegments.some(
      (travelSegment) => travelSegment.modeOfTransport === TravelSegment.TravelMethods.AIRCRAFT
    )
  }

  private isInFinalState() {
    return this.isDeleted() || this.isDenied() || this.isExpenseClaimDenied() || this.isExpensed()
  }

  private isInTravelDeskFlow() {
    return (
      this.isTravelDeskDraft() ||
      this.isTravelDeskSubmitted() ||
      this.isTravelDeskOptionsProvided() ||
      this.isTravelDeskOptionsRanked() ||
      this.isTravelDeskBooked() ||
      this.isTravelDeskComplete()
    )
  }
}

export default StateFlagsSerializer
