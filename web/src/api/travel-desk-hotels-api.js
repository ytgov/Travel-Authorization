import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-desk-hotel.ts */
export const TRAVEL_DESK_RENTAL_CAR_STATUSES = Object.freeze({
  REQUESTED: "Requested",
  // TODO: confirm this is correct.
  RESERVED: "Reserved", // Uncofirmed, but seems likely.
})

export const travelDeskHotelsApi = {
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-desk-hotels", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  // TODO: build back-end endpoint
  async get(travelDeskHotelId, params = {}) {
    const { data } = await http.get(`/api/travel-desk-hotels/${travelDeskHotelId}`, {
      params,
    })
    return data
  },
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-hotels", attributes)
    return data
  },
  async update(travelDeskHotelId, attributes) {
    const { data } = await http.patch(`/api/travel-desk-hotels/${travelDeskHotelId}`, attributes)
    return data
  },
  async delete(travelDeskHotelId) {
    const { data } = await http.delete(`/api/travel-desk-hotels/${travelDeskHotelId}`)
    return data
  },
}

export default travelDeskHotelsApi
