import http from "@/api/http-client"

/**
 * @typedef {{
 *   id: number;
 *   preApprovalId: number;
 *   profileName: string;
 *   department: string;
 *   branch: string;
 *   createdAt: string;
 *   updatedAt: string;
 * }} TravelAuthorizationPreApprovalProfile
 */

/**
 * @typedef {{
 *   id?: number;
 *   preApprovalId?: number;
 *   profileName?: string;
 *   department?: string;
 *   branch?: string;
 * }} TravelAuthorizationPreApprovalProfileWhereOptions
 */

/**
 * @typedef {{
 *  approved?: true;
 *  openDateOrBeforeStartDate?: true;
 * }} TravelAuthorizationPreApprovalProfileFiltersOptions
 */

export const travelAuthorizationPreApprovalProfilesApi = {
  /**
   * @param {{
   *   where?: TravelAuthorizationPreApprovalProfileWhereOptions;
   *   filters?: TravelAuthorizationPreApprovalProfileFiltersOptions;
   *   page?: number;
   *   perPage?: number
   * }} [params={}]
   * @returns {Promise<{
   *   travelAuthorizationPreApprovalProfiles: TravelAuthorizationPreApprovalProfile[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/travel-authorization-pre-approval-profiles", {
      params,
    })
    return data
  },
  /**
   * @param {number} profileId
   * @returns {Promise<{
   *   travelAuthorizationPreApprovalProfile: TravelAuthorizationPreApprovalProfile;
   * }>}
   */
  async get(profileId) {
    const { data } = await http.get(`/api/travel-authorization-pre-approval-profiles/${profileId}`)
    return data
  },
}

export default travelAuthorizationPreApprovalProfilesApi
