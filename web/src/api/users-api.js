import { isString } from "lodash"

import http from "@/api/http-client"

import debounceWithArgsCache from "@/utils/debounce-with-args-cache"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

// Must match role names in api/src/models/role.ts
export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  PRE_APPROVED_TRAVEL_ADMIN: "pre_approved_travel_admin",
  DEPARTMENT_ADMIN: "department_admin",
  TRAVEL_DESK_USER: "travel_desk_user",
})

/** @typedef {USER_ROLES[keyof USER_ROLES]} UserRoles */

/**
 * sub - Auth0 subject attribute
 * @typedef {{
 *   id: number;
 *   sub: string;
 *   email: string;
 *   status: string;
 *   firstName: string | null;
 *   lastName: string | null;
 *   roles: UserRoles[];
 *   department: string | null;
 *   division: string | null;
 *   branch: string | null;
 *   unit: string | null;
 *   mailcode: string | null;
 *   manager: string | null;
 *   lastSyncSuccessAt: string | null;
 *   lastSyncFailureAt: string | null;
 *   createdAt: string;
 *   updatedAt: string;
 * }} User
 */

/**
 * @typedef {User & {
 *  displayName: string
 * }} UserDetailedView
 */

/**
 * Keep in sync with api/src/models/user.ts
 * @typedef {{
 *   id?: number;
 *   sub?: string;
 *   email?: string;
 *   status?: string;
 *   firstName?: string;
 *   lastName?: string;
 *   roles?: UserRoles[];
 *   department?: string;
 *   division?: string;
 *   branch?: string;
 *   unit?: string;
 *   mailcode?: string;
 *   manager?: string;
 * }} UserWhereOptions
 */

/**
 * // match with model scopes signatures
 * @typedef {{
 * }} UserFiltersOptions
 */

/**
 * @typedef {{
 *   where?: UserWhereOptions;
 *   filters?: UserFiltersOptions;
 *   page?: number;
 *   perPage?: number
 * }} UserQueryOptions
 */

export const usersApi = {
  ROLES: USER_ROLES,
  /**
   * @param {UserQueryOptions} params
   * @returns {Promise<{
   *   users: User[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/users", { params })
    return data
  },
  /**
   * @returns {Promise<{ user: UserDetailedView }>}
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
  /**
   * @returns {Promise<{ user: UserDetailedView }>}
   */
  async get(userId, params = {}) {
    const { data } = await http.get(`/api/users/${userId}`, { params })
    return data
  },
  /**
   * @returns {Promise<{ user: UserDetailedView }>}
   */
  async ygGovernmentDirectorySync(userId) {
    const { data } = await http.post(`/api/users/${userId}/yg-government-directory-sync`)
    return data
  },
}

usersApi.get = debounceWithArgsCache(usersApi.get)

export default usersApi
