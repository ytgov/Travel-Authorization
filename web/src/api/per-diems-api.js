import http from "@/api/http-client"

/** @typedef {import('@/api/base-api.js').Policy} Policy */

/** Keep in sync with api/src/models/per-diem.ts */
export const PER_DIEM_CLAIM_TYPES = Object.freeze({
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  INCIDENTALS: "incidentals",
  PRIVATE_ACCOMMODATIONS: "private_accommodations",
})

/** Keep in sync with api/src/models/per-diem.ts */
export const PER_DIEM_TRAVEL_REGIONS = Object.freeze({
  US: "US",
  YUKON: "Yukon",
  NWT: "NWT",
  CANADA: "Canada",
  NUNAVUT: "Nunavut",
  ALASKA: "Alaska",
})

/** Keep in sync with api/src/models/per-diem.ts */
export const PER_DIEM_CURRENCY_TYPES = Object.freeze({
  USD: "USD",
  CAD: "CAD",
})

/** @typedef {PER_DIEM_CLAIM_TYPES[keyof PER_DIEM_CLAIM_TYPES]} ClaimType */
/** @typedef {PER_DIEM_TRAVEL_REGIONS[keyof PER_DIEM_TRAVEL_REGIONS]} TravelRegion */
/** @typedef {PER_DIEM_CURRENCY_TYPES[keyof PER_DIEM_CURRENCY_TYPES]} CurrencyType */

/**
 * @typedef {{
 *   id: string;
 *   claimType: ClaimType;
 *   travelRegion: TravelRegion;
 *   amount: number;
 *   currency: CurrencyType;
 *   createdAt: string;
 *   updatedAt: string;
 * }} PerDiem
 */

/**
 * @typedef {{
 *   claimType?: ClaimType;
 *   travelRegion?: TravelRegion;
 *   currency?: CurrencyType;
 * }} PerDiemWhereOptions
 */

/**
 * @typedef {{
 *  // match with model scopes signatures
 * }} PerDiemFiltersOptions
 */

export const perDiemsApi = {
  /**
   * @param {{
   *   where?: PerDiemWhereOptions;
   *   filters?: PerDiemFiltersOptions;
   *   page?: number;
   *   perPage?: number
   * }} [params={}]
   * @returns {Promise<{
   *   perDiems: PerDiem[];
   *   totalCount: number;
   * }>}
   */
  async list(params = {}) {
    const { data } = await http.get("/api/per-diems", {
      params,
    })
    return data
  },
  /**
   * @param {number} perDiemId
   * @returns {{
   *   perDiem: PerDiem;
   *   policy: Policy;
   * }}
   */
  async get(perDiemId) {
    const { data } = await http.get(`/api/per-diems/${perDiemId}`)
    return data
  },
  /**
   * @param {number} perDiemId
   * @param {Partial<PerDiem>} attributes
   * @returns {{
   *   perDiem: PerDiem;
   * }}
   */
  async update(perDiemId, attributes) {
    const { data } = await http.patch(`/api/per-diems/${perDiemId}`, attributes)
    return data
  },
}

export default perDiemsApi
