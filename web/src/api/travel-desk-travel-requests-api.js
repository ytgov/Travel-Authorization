import http from "@/api/http-client"

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
}

export default travelDeskTravelRequestsApi
