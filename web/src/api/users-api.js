import { isString } from "lodash"

import http from "@/api/http-client"

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} sub - Auth0 subject attribute
 * @property {string} email
 * @property {string} status
 * @property {(string|null)} firstName
 * @property {(string|null)} lastName
 * @property {string[]} roles
 * @property {(string|null)} department
 * @property {(string|null)} division
 * @property {(string|null)} branch
 * @property {(string|null)} unit
 * @property {(string|null)} mailcode
 * @property {(string|null)} manager
 * @property {(string|null)} lastSyncSuccessAt
 * @property {(string|null)} lastSyncFailureAt
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * extra attributes added by serializer
 * @property {string} displayName
 */

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
  /**
   * @returns {Promise<{ user: User }>}
   */
  async me() {
    const { data } = await http.get("/api/user/me")
    return data
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
