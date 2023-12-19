import http from "@/api/http-client"

export const prefillApi = {
  create(travelAuthorizationId) {
    return http
      .post(`/api/travel-authorizations/${travelAuthorizationId}/expenses/prefill`)
      .then(({ data }) => data)
  },
}

export default prefillApi
