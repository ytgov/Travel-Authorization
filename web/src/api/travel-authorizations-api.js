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

// TODO: move to stops-api once that exists.
// TODO: fetch accommodation types from backend,
// until then, keep in sync with src/api/services/estimates/bulk-generate.ts
export const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

// TODO: move to stops-api once that exists.
// TODO: load from back-end
export const TRAVEL_METHODS = Object.freeze({
  AIRCRAFT: "Aircraft",
  POOL_VEHICLE: "Pool Vehicle",
  PERSONAL_VEHICLE: "Personal Vehicle",
  RENTAL_VEHICLE: "Rental Vehicle",
  BUS: "Bus",
  OTHER: "Other:",
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
  // State Management Actions
  approve(travelAuthorizationId) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/approve`)
      .then(({ data }) => data)
  },
  deny(travelAuthorizationId) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/deny`)
      .then(({ data }) => data)
  },
}

export default travelAuthorizationsApi
