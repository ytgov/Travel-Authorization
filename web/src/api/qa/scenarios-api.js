import http from "@/api/http-client"

export const scenariosApi = {
  list() {
    return http.get("/api/qa/scenarios").then(({ data }) => data)
  },
  // Non-standard, but convenient for this hacky feature.
  create(scenario) {
    return http.post(`/api/qa/scenarios/${scenario}`).then(({ data }) => data)
  },
}

export default scenariosApi
