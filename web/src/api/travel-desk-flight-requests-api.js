import http from "@/api/http-client"

export const travelDeskFlightRequestsApi = {
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-desk-flight-requests", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  // TODO: build back-end endpoint
  async get(travelDeskFlightRequestId, params = {}) {
    const { data } = await http.get(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`,
      { params }
    )
    return data
  },
  async update(travelDeskFlightRequestId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`,
      attributes
    )
    return data
  },
}

export default travelDeskFlightRequestsApi
