import http from "@/api/http-client"

export const travelAuthorizationActionLogsApi = {
  list({ where, page, perPage } = {}) {
    return http
      .get("/api/travel-authorization-action-logs", {
        params: { where, page, perPage },
      })
      .then(({ data }) => data)
  },
}

export default travelAuthorizationActionLogsApi
