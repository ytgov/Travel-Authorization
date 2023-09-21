import db from '../db/db-client'

import Stop from "../models/stop"
import BaseService from "./base-service"

export class StopsService extends BaseService {
  // Probably should include validation around oneWayTrip/MultiStop parameters?
  static async bulkCreate(formId: number, stops: Stop[]): Promise<Stop[]> {
    if (!stops.every(stop => stop.taid === formId)) {
      throw new Error('All stops must belong to the same form.');
    }

    return db("stops").insert(stops).returning("*")
  }

  static async bulkReplace(formId: number, stops: Stop[]): Promise<Stop[]> {
    if (!stops.every(stop => stop.taid === formId)) {
      throw new Error('All stops must belong to the same form.');
    }

    return db.transaction(async (transaction) => {
      await transaction("stops").where("taid", formId).delete()
      return transaction("stops").insert(stops).returning("*")
    })
  }
}

export default StopsService
