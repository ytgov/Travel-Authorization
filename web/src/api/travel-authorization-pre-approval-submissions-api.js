import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-authorization-pre-approval-submission.ts */
export const STATUSES = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  FINISHED: "finished",
})

export const travelAuthorizationPreApprovalSubmissionsApi = {
  STATUSES,
  // TODO: build back-end
  async list({ where, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-authorization-pre-approval-submissions", {
      params: { where, ...otherParams },
    })
    return data
  },
}

export default travelAuthorizationPreApprovalSubmissionsApi
