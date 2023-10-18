import db from "@/db/db-client"

import { Stop } from "@/models"
import BaseService from "./base-service"

export class StopsService extends BaseService {
  // Probably should include validation around oneWayTrip/MultiStop parameters?
  static async bulkCreate(travelAuthorizationId: number, stops: Stop[]): Promise<Stop[]> {
    if (!stops.every((stop) => stop.taid === travelAuthorizationId)) {
      throw new Error("All stops must belong to the same form.")
    }

    return Stop.bulkCreate(stops)
  }

  static async bulkReplace(travelAuthorizationId: number, stops: Stop[]): Promise<Stop[]> {
    if (!stops.every((stop) => stop.taid === travelAuthorizationId)) {
      throw new Error("All stops must belong to the same form.")
    }

    return db.transaction(async () => {
      await Stop.destroy({ where: { taid: travelAuthorizationId } })
      return Stop.bulkCreate(stops)
    })
  }
}

export default StopsService
