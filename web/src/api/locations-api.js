import http from "@/api/http-client"

export const locationsApi = {
  // TODO: support pagination and filtering
  async list() {
    const { data } = await http.get("/api/locations")
    return data
  },
  async fetch(locationId) {
    const { data } = await http.get(`/api/locations/${locationId}`)
    return data
  },
}

export default locationsApi
