import http from "@/apis/http-client"

export const formsApi = {
  list(params = {}) {
    return http.get("/api/forms", { params }).then(({ data }) => data)
  },
  create(attributes) {
    return http.post("/api/forms", attributes).then(({ data }) => data)
  },
}

export default formsApi
