import http from "@/api/http-client"

// Must match statues in api/src/models/travel-authorization.ts
export const STATUSES = Object.freeze({
  APPROVED: "approved",
  AWAITING_DIRECTOR_APPROVAL: "awaiting_director_approval",
  BOOKED: "booked",
  CHANGE_REQUESTED: "change_requested",
  DENIED: "denied",
  DRAFT: "draft",
  EXPENSE_CLAIM: "expense_claim",
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
  approve(travelAuthorizationId) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/approve`)
      .then(({ data }) => data)
  },
}

export default travelAuthorizationsApi
