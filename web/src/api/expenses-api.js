import http from "@/api/http-client"

// Must match types in src/api/models/expense.ts
export const TYPES = Object.freeze({
  ESTIMATE: "Estimate",
  EXPENSE: "Expense",
})

export const EXPENSE_TYPES = Object.freeze({
  ACCOMMODATIONS: "Accommodations",
  TRANSPORTATION: "Transportation",
  MEALS_AND_INCIDENTALS: "Meals & Incidentals",
  NON_TRAVEL_STATUS: "Non-Travel Status",
})

export const expensesApi = {
  TYPES,
  EXPENSE_TYPES,
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
  upload(expenseId, file) {
    const formData = new FormData()
    formData.append("receipt", file)
    return http
      .post(`/api/expenses/${expenseId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => data)
  },
  download(expenseId) {
    return http
      .get(`/api/expenses/${expenseId}/upload`, {
        responseType: "blob",
      })
      .then((response) => {
        // NOTE: requires exposing Content-Disposition header in api response or CORS config.
        // Matches format set in api/src/controllers/expenses/upload-controller.ts
        const fileName = response.headers["content-disposition"].split("filename=")[1]
        return {
          expense: {
            id: expenseId,
            receiptImage: response.data,
            fileName,
          },
        }
      })
  },
}

export default expensesApi
