import http from "@/apis/http-client"

export const formsApi = {
  list(params = {}) {
    return http.get("/api/forms", { params }).then(({ data }) => data)
  },
  get(formId, params = {}) {
    return http.get(`/api/forms/${formId}`, { params }).then(({ data }) => data)
  },
  create(attributes) {
    return http.post("/api/forms", attributes).then(({ data }) => data)
  },
  update(formId, attributes) {
    return http.patch(`/api/forms/${formId}`, attributes).then(({ data }) => data)
  },
}

export default formsApi
