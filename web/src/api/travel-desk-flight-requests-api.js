import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

/** Keep in sync with api/src/models/travel-desk-flight-request.ts */
export const SEAT_PREFERENCE_TYPES = Object.freeze({
  WINDOW: "Window",
  AISLE: "Aisle",
  MIDDLE: "Middle",
  NO_PREFERENCE: "No Preference",
})

/** Keep in sync with api/src/models/travel-desk-flight-request.ts */
export const TRAVEL_DESK_FLIGHT_REQUEST_TIME_PREFERENCES = Object.freeze({
  AM: "AM",
  PM: "PM",
})

/** @typedef {SEAT_PREFERENCE_TYPES[keyof SEAT_PREFERENCE_TYPES]} SeatPreferenceTypes */
/** @typedef {TRAVEL_DESK_FLIGHT_REQUEST_TIME_PREFERENCES[keyof TRAVEL_DESK_FLIGHT_REQUEST_TIME_PREFERENCES]} TravelDeskFlightRequestSeatPreferencesTypes */

/**
 * Keep in sync with api/src/models/travel-desk-flight-request.ts
 * @typedef {{
 *   id: number;
 *   travelRequestId: number;
 *   departLocation: string;
 *   arriveLocation: string;
 *   datePreference: string;
 *   timePreference: string;
 *   seatPreference: string;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelDeskFlightRequest
 */

/**
 * @typedef {{
 *   id?: number;
 *   travelRequestId?: number;
 *   departLocation?: string;
 *   arriveLocation?: string;
 *   timePreference?: string;
 *   seatPreference?: string;
 * }} TravelDeskFlightRequestWhereOptions
 */

/**
 * // match with model scopes signatures
 * @typedef {{
 * }} TravelDeskFlightRequestFiltersOptions
 */

/**
 * @typedef {{
 *   where?: TravelDeskFlightRequestWhereOptions;
 *   filters?: TravelDeskFlightRequestFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }} TravelDeskFlightRequestsQueryOptions
 */

export const travelDeskFlightRequestsApi = {
  /**
   * @param {TravelDeskFlightRequestsQueryOptions} [params={}]
   * @returns {Promise<{
   *   travelDeskFlightRequests: TravelDeskFlightRequest[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-desk-flight-requests", {
      params,
    })
    return data
  },
  /**
   *
   * @param {number} travelDeskFlightRequestId
   * @returns {Promise<{
   *   travelDeskFlightRequest: TravelDeskFlightRequest;
   *   policy: Policy;
   * }>}
   */
  async get(travelDeskFlightRequestId) {
    const { data } = await http.get(`/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`)
    return data
  },
  /**
   * @param {Partial<TravelDeskFlightRequest>} attributes
   * @returns {Promise<{
   *   travelDeskFlightRequest: TravelDeskFlightRequest;
   * }>}
   */
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-flight-requests", attributes)
    return data
  },
  /**
   *
   * @param {number} travelDeskFlightRequestId
   * @param {Partial<TravelDeskFlightRequest>} attributes
   * @returns {Promise<{
   *   travelDeskFlightRequest: TravelDeskFlightRequest;
   * }>}
   */
  async update(travelDeskFlightRequestId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`,
      attributes
    )
    return data
  },
  /**
   *
   * @param {number} travelDeskFlightRequestId
   * @returns {Promise<void>}
   */
  async delete(travelDeskFlightRequestId) {
    const { data } = await http.delete(
      `/api/travel-desk-flight-requests/${travelDeskFlightRequestId}`
    )
    return data
  },
}

export default travelDeskFlightRequestsApi
