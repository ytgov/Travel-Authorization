import http from "@/api/http-client"

// TODO: fetch accommodation types from backend,
// until then, keep in sync with src/api/services/estimates/bulk-generate.ts
export const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

// TODO: load from back-end
export const TRAVEL_METHODS = Object.freeze({
  AIRCRAFT: "Aircraft",
  POOL_VEHICLE: "Pool Vehicle",
  PERSONAL_VEHICLE: "Personal Vehicle",
  RENTAL_VEHICLE: "Rental Vehicle",
  BUS: "Bus",
  OTHER: "Other:",
})

export const stopsApi = {
  TRAVEL_METHODS,
  ACCOMMODATION_TYPES,
  list({ where } = {}) {
    return http.get("/api/stops", { params: { where } }).then(({ data }) => data)
  },
}

export default stopsApi
