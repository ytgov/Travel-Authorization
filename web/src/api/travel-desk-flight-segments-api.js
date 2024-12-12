import http from "@/api/http-client"

/**
 * Keep in sync with api/src/models/travel-desk-flight-segment.ts
 * @typedef {{
 *   id: number;
 *   flightOptionId: number;
 *   flightNumber: string;
 *   departAt: string;
 *   departLocation: string;
 *   arriveAt: string;
 *   arriveLocation: string;
 *   duration: string;
 *   status: string;
 *   class: string;
 *   sortOrder: number;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelDeskFlightSegment
 */

/**
 * @typedef {{
 *   id?: number;
 *   flightOptionId?: number;
 *   flightNumber?: string;
 *   departLocation?: string;
 *   arriveLocation?: string;
 *   status?: string;
 *   class?: string;
 *   sortOrder?: number;
 * }} TravelDeskFlightSegmentWhereOptions
 */

/**
 * // match with model scopes signatures
 * @typedef {{
 * }} TravelDeskFlightSegmentFiltersOptions
 */

/**
 * @typedef {{
 *   where?: TravelDeskFlightSegmentWhereOptions;
 *   filters?: TravelDeskFlightSegmentFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }} TravelDeskFlightSegmentsQueryOptions
 */

export const travelDeskFlightSegmentsApi = {
  /**
   * @param {TravelDeskFlightSegmentsQueryOptions} [params={}]
   * @returns {Promise<{
   *   travelDeskFlightSegments: TravelDeskFlightSegment[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-desk-flight-segments", {
      params,
    })
    return data
  },

  /**
   * @param {number} travelDeskFlightSegmentId
   * @returns {Promise<{
   *   travelDeskFlightSegment: TravelDeskFlightSegment;
   *   policy: Policy;
   * }>}
   */
  async get(travelDeskFlightSegmentId) {
    const { data } = await http.get(`/api/travel-desk-flight-segments/${travelDeskFlightSegmentId}`)
    return data
  },

  /**
   * @param {Partial<TravelDeskFlightSegment>} attributes
   * @returns {Promise<{
   *   travelDeskFlightSegment: TravelDeskFlightSegment;
   * }>}
   */
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-flight-segments", attributes)
    return data
  },

  /**
   * @param {number} travelDeskFlightSegmentId
   * @param {Partial<TravelDeskFlightSegment>} attributes
   * @returns {Promise<{
   *   travelDeskFlightSegment: TravelDeskFlightSegment;
   * }>}
   */
  async update(travelDeskFlightSegmentId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-flight-segments/${travelDeskFlightSegmentId}`,
      attributes
    )
    return data
  },

  /**
   * @param {number} travelDeskFlightSegmentId
   * @returns {Promise<void>}
   */
  async delete(travelDeskFlightSegmentId) {
    await http.delete(`/api/travel-desk-flight-segments/${travelDeskFlightSegmentId}`)
  },
}

export default travelDeskFlightSegmentsApi
