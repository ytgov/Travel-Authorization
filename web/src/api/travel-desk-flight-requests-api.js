import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-desk-flight-request.ts */
export const SEAT_PREFERENCE_TYPES = Object.freeze({
  WINDOW: "Window",
  AISLE: "Aisle",
  MIDDLE: "Middle",
  NO_PREFERENCE: "No Preference",
})

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
  async update(travelDeskFlightRequestId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`,
      attributes
    )
    return data
  },
  async delete(travelDeskFlightRequestId) {
    const { data } = await http.delete(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`
    )
    return data
  },
}

export default travelDeskFlightRequestsApi
