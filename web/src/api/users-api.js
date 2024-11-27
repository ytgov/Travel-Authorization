import { isString } from "lodash"

import http from "@/api/http-client"

import debounceWithArgsCache from "@/utils/debounce-with-args-cache"

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

// Must match role names in api/src/models/role.ts
export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  PRE_APPROVED_TRAVEL_ADMIN: "pre_approved_travel_admin",
  DEPARTMENT_ADMIN: "department_admin",
  TRAVEL_DESK_USER: "travel_desk_user",
})

export const usersApi = {
  ROLES: USER_ROLES,
  /**
   * @returns {Promise<{ user: User }>}
   */
  async me() {
    const { data } = await http.get("/api/user/me")
    return data
  },
  async search({ email, ...otherParams } = {}) {
    if (isString(email) && email.length >= 3) {
      const { data } = await http.get("/api/lookup/emailList", { params: { email, otherParams } })
      return { emails: data }
    } else {
      return Promise.resolve([])
    }
  },
  async get(userId, params = {}) {
    const { data } = await http.get(`/api/users/${userId}`, { params })
    return data
  },
  async ygGovernmentDirectorySync(userId) {
    const { data } = await http.post(`/api/users/${userId}/yg-government-directory-sync`)
    return data
  },
}

usersApi.get = debounceWithArgsCache(usersApi.get)

export default usersApi
