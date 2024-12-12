import { computed, unref } from "vue"
import { STATUSES as TRAVEL_AUTHORIZATION_STATUSES } from "@/use/use-travel-authorization"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"

/** @typedef {import('@/api/travel-authorizations-api').TravelAuthorization} TravelAuthorization */
/** @typedef {import('@/api/travel-desk-travel-requests-api').TravelDeskTravelRequest} TravelDeskTravelRequest */

/**
 * @param {import('vue').Ref<TravelAuthorization & { travelDeskTravelRequest: TravelDeskTravelRequest }>} travelAuthorization
 */
export function useTravelAuthorizationStates(travelAuthorization) {
  const isDraft = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT
  )

  const isDeleted = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.DELETED
  )

  const isSubmitted = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
  )

  const isApproved = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.APPROVED
  )

  const isDenied = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.DENIED
  )

  const isChangeRequested = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.CHANGE_REQUESTED
  )

  const isBooked = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.BOOKED
  )

  const isExpenseClaimSubmitted = computed(
    () =>
      unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.EXPENSE_CLAIM_SUBMITTED
  )

  const isExpenseClaimApproved = computed(
    () =>
      unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.EXPENSE_CLAIM_APPROVED
  )

  const isExpenseClaimDenied = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.EXPENSE_CLAIM_DENIED
  )

  const isExpensed = computed(
    () => unref(travelAuthorization)?.status === TRAVEL_AUTHORIZATION_STATUSES.EXPENSED
  )

  // Travel Desk Request States
  const isTravelDeskDraft = computed(
    () =>
      unref(travelAuthorization)?.travelDeskTravelRequest?.status ===
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.DRAFT
  )

  const isTravelDeskSubmitted = computed(
    () =>
      unref(travelAuthorization)?.travelDeskTravelRequest?.status ===
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.SUBMITTED
  )

  const isTravelDeskOptionsProvided = computed(
    () =>
      unref(travelAuthorization)?.travelDeskTravelRequest?.status ===
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_PROVIDED
  )

  const isTravelDeskOptionsRanked = computed(
    () =>
      unref(travelAuthorization)?.travelDeskTravelRequest?.status ===
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_RANKED
  )

  const isTravelDeskBooked = computed(
    () =>
      unref(travelAuthorization)?.travelDeskTravelRequest?.status ===
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.BOOKED
  )

  const isTravelDeskComplete = computed(
    () =>
      unref(travelAuthorization)?.travelDeskTravelRequest?.status ===
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.COMPLETE
  )

  // Composite States
  const isInFinalState = computed(
    () => isDeleted.value || isDenied.value || isExpenseClaimDenied.value || isExpensed.value
  )

  const isInTravelDeskFlow = computed(
    () =>
      isTravelDeskDraft.value ||
      isTravelDeskSubmitted.value ||
      isTravelDeskOptionsProvided.value ||
      isTravelDeskOptionsRanked.value ||
      isTravelDeskBooked.value ||
      isTravelDeskComplete.value
  )

  return {
    // Main Travel Authorization States
    isDraft,
    isDeleted,
    isSubmitted,
    isApproved,
    isDenied,
    isChangeRequested,
    isBooked,
    isExpenseClaimSubmitted,
    isExpenseClaimApproved,
    isExpenseClaimDenied,
    isExpensed,

    // Travel Desk Request States
    isTravelDeskDraft,
    isTravelDeskSubmitted,
    isTravelDeskOptionsProvided,
    isTravelDeskOptionsRanked,
    isTravelDeskBooked,
    isTravelDeskComplete,

    // Composite States
    isInFinalState,
    isInTravelDeskFlow,
  }
}

export default useTravelAuthorizationStates
