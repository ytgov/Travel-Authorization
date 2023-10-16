import http from "@/apis/http-client"

export const locationsApi = {
  // TODO: support pagination and filtering
  list() {
    return http
      .get("/api/locations")
      .then(({ data }) => data)
  },
}

export default locationsApi
