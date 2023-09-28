import { groupBy } from "lodash"

import db from "../db/db-client"

import BaseModel from "./base-model"

export class Preapproved extends BaseModel {
  preTID: number
  department: string | null
  branch: string | null
  purpose: string | null
  reason: string | null
  startDate: Date | null
  endDate: Date | null
  dateUnkInd: number
  month: string | null
  estimatedCost: number
  travelerUnkInd: number
  numberTravelers: number | null
  travelerNotes: string | null
  location: string
  status: string | null
  preTSubID: number | null

  constructor(
    attributes: Pick<
      Preapproved,
      "preTID" | "dateUnkInd" | "estimatedCost" | "travelerUnkInd" | "location"
    > &
      Partial<Preapproved>
  ) {
    super()
    this.preTID = attributes.preTID
    this.department = attributes.department || null
    this.branch = attributes.branch || null
    this.purpose = attributes.purpose || null
    this.reason = attributes.reason || null
    this.startDate = attributes.startDate || null
    this.endDate = attributes.endDate || null
    this.dateUnkInd = attributes.dateUnkInd
    this.month = attributes.month || null
    this.estimatedCost = attributes.estimatedCost
    this.travelerUnkInd = attributes.travelerUnkInd
    this.numberTravelers = attributes.numberTravelers || null
    this.travelerNotes = attributes.travelerNotes || null
    this.location = attributes.location
    this.status = attributes.status || null
    this.preTSubID = attributes.preTSubID || null
  }

  static async findAll({
    where = {},
    include = [],
  }: {
    where?: {}
    include?: "preApprovedTravelers"[]
  }): Promise<Preapproved[]> {
    const preApprovedRequests = await db("preapproved").where(where)

    if (include.includes("preApprovedTravelers")) {
      const preApprovedRequestIds = preApprovedRequests.map((request) => request.preTID)
      const preApprovedTravelersByPreApprovedRequestId = await db("preapprovedTravelers")
        .whereIn("preTID", preApprovedRequestIds)
        .then((traveler) => groupBy(traveler, "preTID"))
      preApprovedRequests.forEach((request) => {
        const preApprovedRequestId = request.preTID
        request.preApprovedTravelers =
          preApprovedTravelersByPreApprovedRequestId[preApprovedRequestId]
      })
    }

    return preApprovedRequests
  }
}

export default Preapproved
