import { isString } from "lodash"

import http from "@/api/http-client"

// Must match roles in api/src/models/user.ts
export const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  PAT_ADMIN: "pat_admin",
  DEPARTMENT_ADMIN: "department_admin",
  TD_USER: "td_user",
})

export const usersApi = {
  ROLES,
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
