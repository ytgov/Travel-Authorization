import db from '../db/db-client'

import Stop from "../models/stop"
import BaseService from "./base-service"

export class StopsService extends BaseService {
  static async bulkReplace(formId: number, stops: Stop[]): Promise<Stop[]> {
    return db.transaction(async (transaction) => {
      await transaction("stops").where("taid", formId).delete()
      return transaction("stops").insert(stops).returning("*")
    })
  }
}

export default StopsService
