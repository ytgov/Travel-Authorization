import http from "@/apis/http-client"

export const generateApi = {
  create(formId) {
    return http.post(`/api/forms/${formId}/estimates/generate`).then(({ data }) => data)
  },
}

export default generateApi
