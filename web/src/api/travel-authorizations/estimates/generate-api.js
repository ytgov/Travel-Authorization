import http from "@/api/http-client"

export const generateApi = {
  create(travelAuthorizationId) {
    return http.post(`/api/travel-authorizations/${travelAuthorizationId}/estimates/generate`).then(({ data }) => data)
  },
}

export default generateApi
