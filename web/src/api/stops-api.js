import http from "@/api/http-client"

// TODO: fetch accommodation types from backend,
// until then, keep in sync with api/src/models/travel-segment.ts
export const ACCOMMODATION_TYPES = Object.freeze({
  HOTEL: "Hotel",
  PRIVATE: "Private",
  OTHER: "Other:",
})

// TODO: load from back-end
// until then, keep in sync with api/src/models/travel-segment.ts
export const TRAVEL_METHODS = Object.freeze({
  AIRCRAFT: "Aircraft",
  POOL_VEHICLE: "Pool Vehicle",
  PERSONAL_VEHICLE: "Personal Vehicle",
  RENTAL_VEHICLE: "Rental Vehicle",
  BUS: "Bus",
  OTHER: "Other:",
})

/*
DEPRECATED: Whenever you use this model, try and figure out how to migrate
the functionality to the TravelSegment model instead.
It was too large a project to migrate to the TravelSegment model all at once,
so we're doing it piecemeal.
*/
export const stopsApi = {
  TRAVEL_METHODS,
  ACCOMMODATION_TYPES,
  list({ where } = {}) {
    return http.get("/api/stops", { params: { where } }).then(({ data }) => data)
  },
}

export default stopsApi
