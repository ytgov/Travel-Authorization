import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

/**
 * @typedef {{
 *   id: string;
 *   agencyName: string;
 *   agencyInfo: string;
 * }} TravelDeskTravelAgency
 */

/**
 * @typedef {{
 *   agencyName?: ClaimType;
 * }} TravelDeskTravelAgencyWhereOptions
 */

/**
 * // match with model scopes signatures
 * @typedef {{}} TravelDeskTravelAgencyFiltersOptions
 */

export const travelDeskTravelAgenciesApi = {
  /**
   * @param {{
   *   where?: TravelDeskTravelAgencyWhereOptions;
   *   filters?: TravelDeskTravelAgencyFiltersOptions;
   *   page?: number;
   *   perPage?: number
   * }} [params={}]
   * @returns {Promise<{
   *   travelDeskTravelAgencies: TravelDeskTravelAgency[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-desk-travel-agencies", {
      params,
    })
    return data
  },
  /**
   * @param {number} travelDeskTravelAgencyId
   * @returns {Promise<{
   *   travelDeskTravelAgency: TravelDeskTravelAgency;
   *   policy: Policy;
   * }>}
   */
  async get(travelDeskTravelAgencyId) {
    const { data } = await http.get(`/api/travel-desk-travel-agencies/${travelDeskTravelAgencyId}`)
    return data
  },
  /**
   * @param {Partial<TravelDeskTravelAgency>} attributes
   * @returns {Promise<{
   *   travelDeskTravelAgency: TravelDeskTravelAgency;
   * }>}
   */
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-travel-agencies", attributes)
    return data
  },
  /**
   * @param {number} travelDeskTravelAgencyId
   * @param {Partial<TravelDeskTravelAgency>} attributes
   * @returns {Promise<{
   *   travelDeskTravelAgency: TravelDeskTravelAgency;
   * }>}
   */
  async update(travelDeskTravelAgencyId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-travel-agencies/${travelDeskTravelAgencyId}`,
      attributes
    )
    return data
  },
  /**
   * @param {number} travelDeskTravelAgencyId
   * @returns {Promise<{void}>}
   */
  async delete(travelDeskTravelAgencyId) {
    const { data } = await http.delete(
      `/api/travel-desk-travel-agencies/${travelDeskTravelAgencyId}`
    )
    return data
  },
}

export default travelDeskTravelAgenciesApi
