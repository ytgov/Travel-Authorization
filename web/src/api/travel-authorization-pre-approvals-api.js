import http from "@/api/http-client"

export const travelAuthorizationPreApprovalsApi = {
  async list({ where, ...otherParams } = {}) {
    const { data } = await http.get("/api/pre-approved-travel-requests", {
      params: { where, ...otherParams },
    })
    return data
  },
}

export default travelAuthorizationPreApprovalsApi
