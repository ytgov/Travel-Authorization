import http from "@/apis/http-client"

export const expensesApi = {
  list({ where, page, perPage, ...otherParams } = {}) {
    return http
      .get("/api/expenses", { params: { where, page, perPage, ...otherParams } })
      .then(({ data }) => data)
  },
}

export default expensesApi
