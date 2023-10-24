import http from "@/apis/http-client"

export const scenariosApi = {
  list() {
    return http.get("/api/qa/scenarios").then(({ data }) => data)
  },
}

export default scenariosApi
