import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

/** Keep in sync with api/src/models/travel-authorization.ts */
export const STATUSES = Object.freeze({
  APPROVED: "approved",
  AWAITING_DIRECTOR_APPROVAL: "awaiting_director_approval",
  BOOKED: "booked",
  CHANGE_REQUESTED: "change_requested",
  DENIED: "denied",
  DRAFT: "draft",
  EXPENSE_CLAIM_SUBMITTED: "expense_claim_submitted",
  EXPENSE_CLAIM_APPROVED: "expense_claim_approved",
  EXPENSE_CLAIM_DENIED: "expense_claim_denied",
  EXPENSED: "expensed",
  SUBMITTED: "submitted",
})

/** @typedef {STATUSES[keyof STATUSES]} Statuses */

/**
 * @typedef {{
 *   id: string;
 *   userId: string;
 *   createdBy: string | null;
 *   purposeId: string | null;
 *   preApprovalProfileId: string | null;
 *   slug: string;
 *   firstName: string | null;
 *   lastName: string | null;
 *   department: string | null;
 *   division: string | null;
 *   branch: string | null;
 *   unit: string | null;
 *   email: string | null;
 *   mailcode: string | null;
 *   daysOffTravelStatus: string | null;
 *   dateBackToWork: string | null;
 *   travelDuration: string | null;
 *   travelAdvance: string | null;
 *   eventName: string | null;
 *   summary: string | null;
 *   benefits: string | null;
 *   status: Statuses;
 *   stepNumber: string;
 *   supervisorEmail: string | null;
 *   requestChange: string | null;
 *   denialReason: string | null;
 *   oneWayTrip: boolean | null;
 *   multiStop: boolean | null;
 *   travelAdvanceInCents: string | null;
 *   allTravelWithinTerritory: boolean | null;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelAuthorization
 */

export const travelAuthorizationsApi = {
  STATUSES,
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-authorizations", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  /**
   * @param {number} travelAuthorizationId
   * @returns {Promise<{
   *   travelAuthorization: TravelAuthorization;
   *   policy: Policy;
   * }>}
   */
  async get(travelAuthorizationId, params = {}) {
    const { data } = await http.get(`/api/travel-authorizations/${travelAuthorizationId}`, {
      params,
    })
    return data
  },
  async create(attributes) {
    const { data } = await http.post("/api/travel-authorizations", attributes)
    return data
  },
  async update(travelAuthorizationId, attributes) {
    const { data } = await http.patch(
      `/api/travel-authorizations/${travelAuthorizationId}`,
      attributes
    )
    return data
  },
  async delete(travelAuthorizationId) {
    const { data } = await http.delete(`/api/travel-authorizations/${travelAuthorizationId}`)
    return data
  },
  // State Management Actions
  async submit(travelAuthorizationId, attributes) {
    const { data } = await http.post(
      `/api/travel-authorizations/${travelAuthorizationId}/submit`,
      attributes
    )
    return data
  },
  async revertToDraft(travelAuthorizationId) {
    const { data } = await http.post(
      `/api/travel-authorizations/${travelAuthorizationId}/revert-to-draft`
    )
    return data
  },
  async approve(travelAuthorizationId) {
    const { data } = await http.post(`/api/travel-authorizations/${travelAuthorizationId}/approve`)
    return data
  },
  async approveExpenseClaim(travelAuthorizationId) {
    const { data } = await http.post(
      `/api/travel-authorizations/${travelAuthorizationId}/approve-expense-claim`
    )
    return data
  },
  async deny(travelAuthorizationId, { denialReason } = {}) {
    const { data } = await http.post(`/api/travel-authorizations/${travelAuthorizationId}/deny`, {
      denialReason,
    })
    return data
  },
  async expenseClaim(travelAuthorizationId, attributes) {
    const { data } = await http.post(
      `/api/travel-authorizations/${travelAuthorizationId}/expense-claim`,
      attributes
    )
    return data
  },
}

export default travelAuthorizationsApi
