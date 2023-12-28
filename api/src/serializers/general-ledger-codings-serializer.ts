import { pick } from "lodash"

import { GeneralLedgerCoding } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export class GeneralLedgerCodingsSerializer extends BaseSerializer<GeneralLedgerCoding> {
  static asTable(generalLedgerCodings: GeneralLedgerCoding[]) {
    return generalLedgerCodings.map((generalLedgerCoding) => {
      const serializer = new this(generalLedgerCoding)
      return serializer.asTableRow()
    })
  }

  asTableRow() {
    return {
      ...pick(this.record, [
        "id",
        "travelAuthorizationId",
        "code",
        "amount",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default GeneralLedgerCodingsSerializer
