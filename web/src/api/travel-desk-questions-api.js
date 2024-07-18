import http from "@/api/http-client"

/** Keep in sync with api/src/models/travel-desk-question.ts */
export const TRAVEL_DESK_QUESTION_REQUEST_TYPES = Object.freeze({
  FLIGHT: "flight",
  HOTEL: "hotel",
  TRANSPORTATION: "transportation",
  RENTAL_CAR: "rental_car",
})

/** TODO: implement back-end controller and routing for this api*/
export const travelDeskQuestionsApi = {
  REQUEST_TYPES: TRAVEL_DESK_QUESTION_REQUEST_TYPES,

  async list({ where, page, perPage, ...otherParams } = {}) {
    const { data } = await http.get("/api/travel-desk-questions", {
      params: { where, page, perPage, ...otherParams },
    })
    return data
  },
  async get(travelDeskQuestionId, params = {}) {
    const { data } = await http.get(`/api/travel-desk-questions/${travelDeskQuestionId}`, {
      params,
    })
    return data
  },
  async create(attributes) {
    const { data } = await http.post("/api/travel-desk-questions", attributes)
    return data
  },
  async update(travelDeskQuestionId, attributes) {
    const { data } = await http.patch(
      `/api/travel-desk-questions/${travelDeskQuestionId}`,
      attributes
    )
    return data
  },
  async delete(travelDeskQuestionId) {
    const { data } = await http.delete(`/api/travel-desk-questions/${travelDeskQuestionId}`)
    return data
  },
}

export default travelDeskQuestionsApi
