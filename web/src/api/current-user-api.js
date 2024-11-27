import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/users-api.js').UserDetailedView} UserDetailedView */

export const currentUserApi = {
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
