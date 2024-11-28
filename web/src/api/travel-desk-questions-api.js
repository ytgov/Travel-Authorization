import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

/** Keep in sync with api/src/models/travel-desk-question.ts */
export const TRAVEL_DESK_QUESTION_REQUEST_TYPES = Object.freeze({
  FLIGHT: "flight",
  HOTEL: "hotel",
  TRANSPORTATION: "transportation",
  RENTAL_CAR: "rental_car",
})

/** @typedef {TRAVEL_DESK_QUESTION_REQUEST_TYPES[keyof TRAVEL_DESK_QUESTION_REQUEST_TYPES]} TravelDeskQuestionRequestTypes */

/**
 * @typedef {{
 *   id: number;
 *   travelRequestId: number;
 *   requestType: string;
 *   question: string;
 *   response: string | null;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelDeskQuestion
 */

/**
 * @typedef {{
 *   id?: number;
 *   travelRequestId?: number;
 *   requestType?: string;
 * }} TravelDeskQuestionWhereOptions
 */

/**
 * // match with model scopes signatures
 * @typedef {{
 * }} TravelDeskQuestionFiltersOptions
 */

/**
 * @typedef {{
 *   where?: TravelDeskQuestionWhereOptions;
 *   filters?: TravelDeskQuestionFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }} TravelDeskQuestionsQueryOptions
 */

/** TODO: implement back-end controller and routing for this api*/
export const travelDeskQuestionsApi = {
  REQUEST_TYPES: TRAVEL_DESK_QUESTION_REQUEST_TYPES,

  /**
   * @param {TravelDeskQuestionsQueryOptions} [params={}]
   * @returns {Promise<{
   *   travelDeskQuestions: TravelDeskQuestion[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-desk-questions", {
      params,
    })
    return data
  },
  /**
   * @param {number} travelDeskQuestionId
   * @returns {Promise<{
   *   travelDeskQuestion: TravelDeskQuestion;
   *   policy: Policy;
   * }>}
   */
  async get(travelDeskQuestionId) {
    const { data } = await http.get(`/api/travel-desk-questions/${travelDeskQuestionId}`)
    return data
  },
  /**
   *
   * @param {Partial<TravelDeskQuestion>} attributes
   * @returns {Promise<{
   *   travelDeskQuestion: TravelDeskQuestion;
   * }>}
   */
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-questions", attributes)
    return data
  },
  /**
   * @param {number} travelDeskQuestionId
   * @param {Partial<TravelDeskQuestion>} attributes
   * @returns {Promise<{
   *   travelDeskQuestion: TravelDeskQuestion;
   * }>}
   */
  async update(travelDeskQuestionId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-questions/${travelDeskQuestionId}`,
      attributes
    )
    return data
  },
  /**
   * @param {number} travelDeskQuestionId
   * @returns {Promise<void>}
   */
  async delete(travelDeskQuestionId) {
    const { data } = await http.delete(`/api/travel-desk-questions/${travelDeskQuestionId}`)
    return data
  },
}

export default travelDeskQuestionsApi
