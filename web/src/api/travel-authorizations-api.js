import http from "@/api/http-client"

export const travelAuthorizationsApi = {
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
}

export default travelAuthorizationsApi
