import http from "@/api/http-client"

export const travelAuthorizationPreApprovalProfilesApi = {
  async list({ where, filters, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-authorization-pre-approval-profiles", {
      params: { where, filters, ...otherParams },
    })
    return data
  },
}

export default travelAuthorizationPreApprovalProfilesApi
