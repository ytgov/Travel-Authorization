import http from "@/api/http-client"

/**
 * @typedef {{
 *   id: number;
 *   purpose: string;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelPurpose
 */

/**
 * @typedef {{
 *   id?: number;
 *   purpose?: string;
 * }} TravelPurposeWhereOptions
 */

/**
 * // match with model scopes signatures
 * @typedef {{
 * }} TravelPurposeFiltersOptions
 */

export const travelPurposesApi = {
  /**
   * @param {{
   *   where?: TravelPurposeWhereOptions;
   *   filters?: TravelPurposeFiltersOptions;
   *   page?: number;
   *   perPage?: number
   * }} [params={}]
   * @returns {Promise<{
   *   travelPurposes: TravelPurpose[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-purposes", { params })
    return data
  },
}

export default travelPurposesApi
