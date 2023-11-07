import http from "@/api/http-client"

export const preApprovedTravelRequestsApi = {
  list({ where, ...otherParams } = {}) {
    return http
      .get("/api/pre-approved-travel-requests", { params: { where, ...otherParams } })
      .then(({ data }) => data)
  },
}

export default preApprovedTravelRequestsApi
