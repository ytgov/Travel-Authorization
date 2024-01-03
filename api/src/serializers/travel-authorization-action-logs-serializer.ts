import { pick } from "lodash"

import { TravelAuthorizationActionLog } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class TravelAuthorizationActionLogsSerializer extends BaseSerializer<TravelAuthorizationActionLog> {
  static asTable(TravelAuthorizationActionLogs: TravelAuthorizationActionLog[]) {
    return TravelAuthorizationActionLogs.map((TravelAuthorizationActionLog) => {
      const serializer = new this(TravelAuthorizationActionLog)
      return serializer.asTableRow()
    })
  }

  asTableRow() {
    return {
      ...pick(this.record, [
        "id",
        "travelAuthorizationId",
        "actorId",
        "assigneeId",
        "action",
        "note",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default TravelAuthorizationActionLogsSerializer
