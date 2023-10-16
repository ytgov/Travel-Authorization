import { keyBy } from "lodash"

import db from "@/db/db-client-legacy"

import BaseModel from "./base-model"
import Preapproved from "./preapproved"

export class PreapprovedTraveler extends BaseModel {
  travelerID: number
  preTID: number
  fullName: string
  department: string
  branch: string | null

  // Associations
  preApprovedRequest?: Preapproved

  constructor(
    attributes: Pick<PreapprovedTraveler, "travelerID" | "preTID" | "fullName" | "department"> &
      Partial<PreapprovedTraveler>
  ) {
    super()
    this.travelerID = attributes.travelerID
    this.preTID = attributes.preTID
    this.fullName = attributes.fullName
    this.department = attributes.department
    this.branch = attributes.branch || null
  }

  static async findAll({
    where = {},
    include = [],
    limit = 1000,
    offset = 0,
  }: {
    where?: {}
    include?: "preApprovedRequest"[]
    limit?: number
    offset?: number
  } = {}): Promise<PreapprovedTraveler[]> {
    const preApprovedTravelers = await db<PreapprovedTraveler>("preapprovedTravelers")
      .where(where)
      .limit(limit)
      .offset(offset)

    if (include.includes("preApprovedRequest")) {
      const preApprovedRequestIds = preApprovedTravelers.map((traveler) => traveler.preTID)
      const preApprovedRequestsById = await db<Preapproved>("preapproved")
        .whereIn("preTID", preApprovedRequestIds)
        .then((preApprovedRequests) => keyBy(preApprovedRequests, "preTID"))
      preApprovedTravelers.forEach((traveler) => {
        const preApprovedRequestId = traveler.preTID
        traveler.preApprovedRequest = preApprovedRequestsById[preApprovedRequestId]
      })
    }

    return preApprovedTravelers
  }
}

export default PreapprovedTraveler
