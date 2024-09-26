import http from "@/api/http-client"

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

export const travelAuthorizationsApi = {
  STATUSES,
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-authorizations", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
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
