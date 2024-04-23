import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-desk-rental-car.ts */
export const LOCATION_TYPES = Object.freeze({
  AIRPORT: "Airport",
  HOTEL: "Hotel",
  DOWNTOWN: "Downtown",
  OTHER: "Other",
})

/** Keep in sync with api/src/models/travel-desk-rental-car.ts */
export const TRAVEL_DESK_RENTAL_CAR_STATUSES = Object.freeze({
  REQUESTED: "Requested",
  RESERVED: "Reserved",
})

/** Keep in sync with api/src/models/travel-desk-rental-car.ts */
export const VEHICLE_TYPES = Object.freeze({
  ECONOMY: "Economy",
  COMPACT: "Compact",
  INTERMEDIATE: "Intermediate",
  STANDARD: "Standard",
  FULL_SIZE: "Full-Size",
  INTERMEDIATE_SUV: "Intermediate SUV",
  LUXURY: "Luxury",
  MINIVAN: "Minivan",
  STANDARD_SUV: "Standard SUV",
  FULL_SIZE_SUV: "Full-Size SUV",
  PICKUP_TRUCK: "Pickup Truck",
})

export const travelDeskRentalCarsApi = {
  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-desk-rental-cars", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  // TODO: build back-end endpoint
  async get(travelDeskRentalCarId, params = {}) {
    const { data } = await http.get(`/api/travel-desk-rental-cars/${travelDeskRentalCarId}`, {
      params,
    })
    return data
  },
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-rental-cars", attributes)
    return data
  },
  async update(travelDeskRentalCarId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-rental-cars/${travelDeskRentalCarId}`,
      attributes
    )
    return data
  },
  async delete(travelDeskRentalCarId) {
    const { data } = await http.delete(`/api/travel-desk-rental-cars/${travelDeskRentalCarId}`)
    return data
  },
}

export default travelDeskRentalCarsApi
