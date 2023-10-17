import http from "@/apis/http-client"

export const formsApi = {
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

export default formsApi
