import http from "@/api/http-client"

// Must match types in src/api/models/expense.ts
export const TYPES = Object.freeze({
  ESTIMATE: "Estimate",
})

export const expensesApi = {
  TYPES,
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
  delete(expenseId) {
    return http.delete(`/api/expenses/${expenseId}`).then(({ data }) => data)
  },
}

export default expensesApi
