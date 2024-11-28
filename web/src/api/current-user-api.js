import http from "@/api/http-client"

import { USER_ROLES } from "@/api/users-api"

export { USER_ROLES }

/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/users-api.js').UserDetailedView} UserDetailedView */
/** @typedef {USER_ROLES[keyof USER_ROLES]} UserRoles */

export const currentUserApi = {
  ROLES: USER_ROLES,
  /**
   * @returns {Promise<{
   *   user: UserDetailedView;
   *   policy: Policy;
   * }>}
   */
  async get() {
    const { data } = await http.get(`/api/current-user`)
    return data
  },
}

export default currentUserApi
