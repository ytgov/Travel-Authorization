import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-desk-travel-request.ts */
export const TRAVEL_DESK_TRAVEL_REQUEST_STATUSES = Object.freeze({
  BOOKED: "booked",
  DRAFT: "draft",
  OPTIONS_PROVIDED: "options_provided",
  OPTIONS_RANKED: "options_ranked",
  SUBMITTED: "submitted",
})

export const travelDeskTravelRequestsApi = {
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-desk-travel-requests", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  async get(travelDeskTravelRequestId, params = {}) {
    const { data } = await http.get(
      `/api/travel-desk-travel-requests/${travelDeskTravelRequestId}`,
      { params }
    )
    return data
  },
  async update(travelDeskTravelRequestId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-travel-requests/${travelDeskTravelRequestId}`,
      attributes
    )
    return data
  },

  // Stateful Actions
  async submit(travelDeskTravelRequestId, attributes) {
    const { data } = await http.post(
      `/api/travel-desk-travel-requests/${travelDeskTravelRequestId}/submit`,
      attributes
    )
    return data
  },
}

export default travelDeskTravelRequestsApi
