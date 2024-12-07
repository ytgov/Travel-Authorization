import http from "@/api/http-client"

/**
 * @typedef {{
 *   travelDeskFlightSegmentId: number
 *   oldSortOrder: number
 *   newSortOrder: number
 * }[]} TravelDeskFlightSegmentOrderAttributes
 */

export const reOrderFlightSegmentsApi = {
  /**
   *
   * @param {number} travelDeskFlightOptionId
   * @param {TravelDeskFlightSegmentOrderAttributes} travelDeskFlightSegmentOrderAttributes
   * @returns {Promise<{
   *   message: string
   * }>}
   */
  async create(travelDeskFlightOptionId, travelDeskFlightSegmentOrderAttributes) {
    const { data } = await http.post(
      `/api/travel-desk-flight-options/${travelDeskFlightOptionId}/re-order-flight-segments`,
      travelDeskFlightSegmentOrderAttributes
    )
    return data
  },
}

export default reOrderFlightSegmentsApi
