import { isString } from "lodash"

import http from "@/api/http-client"

export const usersApi = {
  me() {
    return http.get("/api/user/me").then(({ data }) => data)
  },
  search({ email, ...otherParams } = {}) {
    if (isString(email) && email.length >= 3) {
      return http
        .get("/api/lookup/emailList", { params: { email, otherParams } })
        .then(({ data }) => ({ emails: data }))
    } else {
      return Promise.resolve([])
    }
  },
  get(userId, params = {}) {
    return http.get(`/api/users/${userId}`, { params }).then(({ data }) => data)
  },
  ygGovernmentDirectorySync(userId) {
    return http.post(`/api/users/${userId}/yg-government-directory-sync`).then(({ data }) => data)
  },
}

export default usersApi
