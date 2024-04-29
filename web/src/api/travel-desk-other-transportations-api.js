import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-desk-other-transportation.ts */
export const TRAVEL_DESK_OTHER_TRANSPORTATION_STATUSES = Object.freeze({
  REQUESTED: "Requested",
  RESERVED: "Reserved",
})

/** Keep in sync with api/src/models/travel-desk-other-transportation.ts */
export const TRANSPORTATION_TYPES = Object.freeze({
  SHUTTLE: "Shuttle",
  BUS: "Bus",
  TRAIN: "Train",
})

export const travelDeskOtherTransportationsApi = {
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-desk-other-transportations", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  // TODO: build back-end endpoint
  async get(travelDeskOtherTransportationId, params = {}) {
    const { data } = await http.get(
      `/api/travel-desk-other-transportations/${travelDeskOtherTransportationId}`,
      {
        params,
      }
    )
    return data
  },
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-other-transportations", attributes)
    return data
  },
  async update(travelDeskOtherTransportationId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-other-transportations/${travelDeskOtherTransportationId}`,
      attributes
    )
    return data
  },
  async delete(travelDeskOtherTransportationId) {
    const { data } = await http.delete(
      `/api/travel-desk-other-transportations/${travelDeskOtherTransportationId}`
    )
    return data
  },
}

export default travelDeskOtherTransportationsApi
