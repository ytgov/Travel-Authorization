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
  list({ where, page, perPage, ...otherParams } = {}) {
    return http
      .get("/api/travel-authorizations", { params: { where, page, perPage, ...otherParams } })
      .then(({ data }) => data)
  },
  get(travelAuthorizationId, params = {}) {
    return http
      .get(`/api/travel-authorizations/${travelAuthorizationId}`, { params })
      .then(({ data }) => data)
  },
  create(attributes) {
    return http.post("/api/travel-authorizations", attributes).then(({ data }) => data)
  },
  update(travelAuthorizationId, attributes) {
    return http
      .patch(`/api/travel-authorizations/${travelAuthorizationId}`, attributes)
      .then(({ data }) => data)
  },
  delete(travelAuthorizationId) {
    return http
      .delete(`/api/travel-authorizations/${travelAuthorizationId}`)
      .then(({ data }) => data)
  },
  // State Management Actions
  submit(travelAuthorizationId, attributes) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/submit`, attributes)
      .then(({ data }) => data)
  },
  approve(travelAuthorizationId) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/approve`)
      .then(({ data }) => data)
  },
  async deny(travelAuthorizationId, { denialReason } = {}) {
    const { data } = await http.post(`/api/travel-authorizations/${travelAuthorizationId}/deny`, {
      denialReason,
    })
    return data
  },
  expenseClaim(travelAuthorizationId, attributes) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/expense-claim`, attributes)
      .then(({ data }) => data)
  },
}

export default travelAuthorizationsApi
