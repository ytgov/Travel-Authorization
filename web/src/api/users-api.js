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
  ygGovernmentDirectorySync(userId, attributes) {
    return http
      .post(`/api/users/${userId}/yg-government-directory-sync`, attributes)
      .then(({ data }) => data)
  },
}

export default usersApi
