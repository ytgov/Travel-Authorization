import http from "@/apis/http-client"

export const expensesApi = {
  list({ where, page, perPage, ...otherParams } = {}) {
    return http
      .get("/api/expenses", { params: { where, page, perPage, ...otherParams } })
      .then(({ data }) => data)
  },
  create(attributes) {
    return http.post("/api/expenses", attributes).then(({ data }) => data)
  },
  update(expenseId, attributes) {
    return http.patch(`/api/expenses/${expenseId}`, attributes).then(({ data }) => data)
  },
}

export default expensesApi
