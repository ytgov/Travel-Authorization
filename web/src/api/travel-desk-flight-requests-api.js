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
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-flight-requests", attributes)
    return data
  },
  // TODO: build back-end endpoint
  async update(travelDeskFlightRequestId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`,
      attributes
    )
    return data
  },
}

export default travelDeskFlightRequestsApi
