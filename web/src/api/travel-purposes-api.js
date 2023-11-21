import http from "@/api/http-client"

export const travelPurposesApi = {
  list() {
    return http.get("/api/travel-purposes").then(({ data }) => data)
  },
}

export default travelPurposesApi
