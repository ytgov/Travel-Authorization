import { isEmpty, isNil, isUndefined, last, pick, sortBy } from "lodash"

import guessNameCapitalization from "@/integrations/trav-com-integration/utils/guess-name-capitalization"
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
  agentName: string
  flightInfo: string
  finalDestination: string
  department: string
  travelerFirstName: string
  travelerLastName: string

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

    const agentName = this.buildAgentName(this.record)
    const flightInfo = this.buildFlightInfo(this.segments)
    const finalDestination = this.buildFinalDestination(this.segments)
    const department = this.record.invoice.department ?? ""
    const [travelerFirstName, travelerLastName] = this.buildTravelerFirstAndLastName(this.record)

    const invoice = this.serializeInvoice(this.record.invoice)
    const segments = this.serializeSegments(this.segments)

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
      department,
      travelerFirstName,
      travelerLastName,
      invoice,
      segments,
    }
  }

  /**
   * See includeAgentNameAttribute scope
   */
  private buildAgentName(accountReceivableInvoiceDetail: AccountsReceivableInvoiceDetail): string {
    const { dataValues } = accountReceivableInvoiceDetail as AccountsReceivableInvoiceDetail & {
      dataValues: {
        agentName: string | null
      }
    }

    const { agentName } = dataValues
    if (isUndefined(agentName)) {
      throw new Error("'agentName' attribute include is required")
    }

    return agentName ?? ""
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

        const formattedArrivalCityCode = guessNameCapitalization(arrivalCityCode)
        if (isNil(arrivalCity)) {
          return `${airlineCode}${flightNumber} (${formattedArrivalCityCode})`
        }

        const { cityName } = arrivalCity
        if (isNil(cityName) || isEmpty(cityName)) {
          return `${airlineCode}${flightNumber} (${formattedArrivalCityCode})`
        }

        const formattedCityName = guessNameCapitalization(cityName)
        return `${airlineCode}${flightNumber} (${formattedCityName})`
      })
      .map((flightInfo) => flightInfo.replace(/\s/g, "\u00A0"))
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

  private buildTravelerFirstAndLastName(
    accountReceivableInvoiceDetail: AccountsReceivableInvoiceDetail
  ): [string, string] {
    const { passengerName } = accountReceivableInvoiceDetail
    if (isNil(passengerName) || isEmpty(passengerName)) {
      return ["", ""]
    }

    const [lastName, firstNameAndTitle] = passengerName
      .split("/")
      .map((part) => part.trim())
      .map((part) => guessNameCapitalization(part))

    if (
      (isNil(lastName) || isEmpty(lastName)) &&
      (isNil(firstNameAndTitle) || isEmpty(firstNameAndTitle))
    ) {
      return ["", ""]
    }

    const [firstName, _title] = firstNameAndTitle
      .split(" ")
      .map((part) => part.trim())
      .map((part) => guessNameCapitalization(part))
    if (isNil(firstName) || isEmpty(firstName)) {
      return ["", lastName]
    }

    return [firstName, lastName]
  }

  // TODO: move invoice serialization to accounts receivable invoice show serializer
  private serializeInvoice(accountsReceivableInvoice: AccountsReceivableInvoice) {
    return pick(
      accountsReceivableInvoice,
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
  }

  // TODO: move segment serialization to segments show serializer
  private serializeSegments(segments: Segment[]) {
    return segments.map((segment) =>
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
  }

  private get segments(): Segment[] {
    if (isUndefined(this.record.segments)) {
      throw new Error("'segments' association is required")
    }

    return sortBy(this.record.segments, "departureInfo")
  }
}
