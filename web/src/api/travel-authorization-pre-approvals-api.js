import http from "@/api/http-client"

export const travelAuthorizationPreApprovalsApi = {
  async list({ where, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-authorization-pre-approvals", {
      params: { where, ...otherParams },
    })
    return data
  },
}

export default travelAuthorizationPreApprovalsApi
