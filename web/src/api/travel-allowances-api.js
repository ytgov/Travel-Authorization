import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

/** Keep in sync with api/src/models/travel-allowance.ts */
export const TRAVEL_ALLOWANCE_ALLOWANCE_TYPES = Object.freeze({
  MAXIUM_AIRCRAFT_ALLOWANCE: "maxium_aircraft_allowance",
  AIRCRAFT_ALLOWANCE_PER_SEGMENT: "aircraft_allowance_per_segment",
  DISTANCE_ALLOWANCE_PER_KILOMETER: "distance_allowance_per_kilometer",
  HOTEL_ALLOWANCE_PER_NIGHT: "hotel_allowance_per_night",
})

/** Keep in sync with api/src/models/travel-allowance.ts */
export const TRAVEL_ALLOWANCE_CURRENCY_TYPES = Object.freeze({
  USD: "USD",
  CAD: "CAD",
})

/** @typedef {TRAVEL_ALLOWANCE_ALLOWANCE_TYPES[keyof TRAVEL_ALLOWANCE_ALLOWANCE_TYPES]} ClaimType */
/** @typedef {TRAVEL_ALLOWANCE_CURRENCY_TYPES[keyof TRAVEL_ALLOWANCE_CURRENCY_TYPES]} CurrencyType */

/**
 * @typedef {{
 *   id: string;
 *   allowanceType: ClaimType;
 *   amount: number;
 *   currency: CurrencyType;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelAllowance
 */

/**
 * @typedef {{
 *   allowanceType?: ClaimType;
 *   currency?: CurrencyType;
 * }} TravelAllowanceWhereOptions
 */

/**
 * @typedef {{
 *  // match with model scopes signatures
 * }} TravelAllowanceFiltersOptions
 */

export const travelAllowancesApi = {
  /**
   * @param {{
   *   where?: TravelAllowanceWhereOptions;
   *   filters?: TravelAllowanceFiltersOptions;
   *   page?: number;
   *   perPage?: number
   * }} [params={}]
   * @returns {Promise<{
   *   travelAllowances: TravelAllowance[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-allowances", {
      params,
    })
    return data
  },
  /**
   * @param {number} travelAllowanceId
   * @returns {Promise<{
   *   travelAllowance: TravelAllowance;
   *   policy: Policy;
   * }>}
   */
  async get(travelAllowanceId) {
    const { data } = await http.get(`/api/travel-allowances/${travelAllowanceId}`)
    return data
  },
  /**
   * @param {number} travelAllowanceId
   * @param {Partial<TravelAllowance>} attributes
   * @returns {Promise<{
   *   travelAllowance: TravelAllowance;
   * }>}
   */
  async update(travelAllowanceId, attributes) {
    const { data } = await http.patch(`/api/travel-allowances/${travelAllowanceId}`, attributes)
    return data
  },
}

export default travelAllowancesApi
