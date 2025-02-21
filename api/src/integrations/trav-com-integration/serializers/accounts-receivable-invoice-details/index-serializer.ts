import { isEmpty, isNil, isUndefined, last, pick, sortBy } from "lodash"

import {
  AccountsReceivableInvoice,
  AccountsReceivableInvoiceDetail,
  Segment,
} from "@/integrations/trav-com-integration/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AccountsReceivableInvoiceDetailIndexView = Pick<
  AccountsReceivableInvoiceDetail,
  | "id"
  | "invoiceId"
  | "transactionType"
  | "vendorNumber"
  | "vendorName"
  | "productCode"
  | "passengerName"
  | "ticketNumber"
  | "publishedFare"
  | "sellingFare"
  | "referenceFare"
  | "lowFare"
  | "tax1"
  | "grossAmount"
  | "commissionAmount"
  | "vatOnCommission"
  | "freeFieldA"
  | "travelDate"
  | "returnDate"
  | "numberOfDays"
  | "cityCode"
  | "profileNumber"
  | "addedBy"
> & {
  // magic attributes
  agentName: string | null // see includeAgentNameAttribute scope
  flightInfo: string
  finalDestination: string

  // associations
  // TODO: move invoice type definition to accounts-receivable-invoice show serializer
  invoice: Pick<
    AccountsReceivableInvoice,
    | "id"
    | "invoiceNumber"
    | "profileNumber"
    | "profileName"
    | "department"
    | "bookingDate"
    | "systemDate"
    | "description"
    | "invoiceRemarks"
  >
  // TODO: move segment type definition to segments show serializer
  segments: Pick<
    Segment,
    | "id"
    | "invoiceId"
    | "invoiceDetailId"
    | "legNumber"
    | "departureCityCode"
    | "departureInfo"
    | "arrivalCityCode"
    | "arrivalInfo"
    | "airlineCode"
    | "flightNumber"
    | "classOfService"
    | "fareBasis"
  >[]
}

export class IndexSerializer extends BaseSerializer<AccountsReceivableInvoiceDetail> {
  constructor(protected record: AccountsReceivableInvoiceDetail) {
    super(record)
  }

  perform(): AccountsReceivableInvoiceDetailIndexView {
    if (isUndefined(this.record.invoice)) {
      throw new Error("'invoice' association is required")
    }

    const { agentName } = this.record.dataValues as AccountsReceivableInvoiceDetail & {
      agentName: string | null
    }
    const flightInfo = this.buildFlightInfo(this.segments)
    const finalDestination = this.buildFinalDestination(this.segments)

    // TODO: move invoice serialization to accounts receivable invoice show serializer
    const invoice = pick(
      this.record.invoice,
      "id",
      "invoiceNumber",
      "profileNumber",
      "profileName",
      "department",
      "bookingDate",
      "systemDate",
      "description",
      "invoiceRemarks"
    )

    // TODO: move segment serialization to segments show serializer
    const segments = this.segments.map((segment) =>
      pick(
        segment,
        "id",
        "invoiceId",
        "invoiceDetailId",
        "legNumber",
        "departureCityCode",
        "departureInfo",
        "arrivalCityCode",
        "arrivalInfo",
        "airlineCode",
        "flightNumber",
        "classOfService",
        "fareBasis"
      )
    )

    return {
      ...pick(
        this.record,
        "id",
        "invoiceId",
        "transactionType",
        "vendorNumber",
        "vendorName",
        "productCode",
        "passengerName",
        "ticketNumber",
        "publishedFare",
        "sellingFare",
        "referenceFare",
        "lowFare",
        "tax1",
        "grossAmount",
        "commissionAmount",
        "vatOnCommission",
        "freeFieldA",
        "travelDate",
        "returnDate",
        "numberOfDays",
        "cityCode",
        "profileNumber",
        "addedBy"
      ),
      agentName,
      flightInfo,
      finalDestination,
      invoice,
      segments,
    }
  }

  private buildFlightInfo(segments: Segment[]): string {
    return segments
      .map((segment) => {
        const { airlineCode, flightNumber, arrivalCityCode, arrivalCity } = segment
        if (isUndefined(arrivalCity)) {
          throw new Error("Requires segment to preload 'arrivalCity' association")
        }

        if (isNil(arrivalCityCode) || isEmpty(arrivalCityCode)) {
          return `${airlineCode}${flightNumber}`
        }

        if (isNil(arrivalCity)) {
          return `${airlineCode}${flightNumber}\u00A0(${arrivalCityCode})`
        }

        const { cityName } = arrivalCity
        if (isNil(cityName) || isEmpty(cityName)) {
          return `${airlineCode}${flightNumber}\u00A0(${arrivalCityCode})`
        }

        return `${airlineCode}${flightNumber}\u00A0(${cityName})`
      })
      .join(", ")
  }

  private buildFinalDestination(segments: Segment[]): string {
    const lastSegment = last(segments)
    if (isNil(lastSegment)) {
      return ""
    }

    const { arrivalCity } = lastSegment
    if (isUndefined(arrivalCity)) {
      throw new Error("Requires segment to preload 'arrivalCity' association")
    }

    if (isNil(arrivalCity)) {
      return ""
    }

    const { cityName } = arrivalCity
    if (isNil(cityName) || isEmpty(cityName)) {
      return ""
    }

    return cityName
  }

  private get segments(): Segment[] {
    if (isUndefined(this.record.segments)) {
      throw new Error("'segments' association is required")
    }

    return sortBy(this.record.segments, "departureInfo")
  }
}
