import { Attributes, WhereOptions } from "sequelize"
import { isEmpty, isNil } from "lodash"
import { DateTime } from "luxon"

import { AccountsReceivableInvoiceDetail } from "@/integrations/trav-com-integration/models"
import { AccountsReceivableInvoiceDetails } from "@/integrations/trav-com-integration/serializers"

import { FlightReconciliation, User } from "@/models"
import { BaseScopeOptions } from "@/policies"
import BaseService from "@/services/base-service"
import { ModelOrder } from "@/controllers/base-controller"

type AccountsReceivableInvoiceDetailQuery = {
  filters?: Record<string, unknown>
  where?: WhereOptions<Attributes<AccountsReceivableInvoiceDetail>>
  limit?: number
  offset?: number
  order?: ModelOrder[]
}

export class SyncService extends BaseService {
  constructor(
    protected query: AccountsReceivableInvoiceDetailQuery,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<FlightReconciliation[]> {
    const scopes = this.buildFilterScopes()
    const scopedAccountsReceivableInvoiceDetails = AccountsReceivableInvoiceDetail.scope(scopes)

    const { where } = this.query
    const order = this.buildOrder()
    const accountReceivableInvoiceDetails = await scopedAccountsReceivableInvoiceDetails.findAll({
      where,
      limit: this.query.limit,
      offset: this.query.offset,
      order,
      include: [
        "invoice",
        {
          association: "segments",
          include: ["arrivalCity"],
        },
      ],
    })
    const serializedAccountsReceivableInvoiceDetails =
      AccountsReceivableInvoiceDetails.IndexSerializer.perform(accountReceivableInvoiceDetails)

    const flightReconciliationsAttributes = serializedAccountsReceivableInvoiceDetails.map(
      (invoiceDetail) => {
        const { invoice } = invoiceDetail
        const invoiceBookingDate = this.buildBookingDate(invoice.bookingDate)
        return {
          reconcilerId: this.currentUser.id,
          externalTravComIdentifier: invoiceDetail.id,
          invoiceBookingDate,
          invoiceDepartment: invoice.department,
          invoiceDetailSellingFare: invoiceDetail.sellingFare,
          invoiceDetailComputedAgentName: invoiceDetail.agentName,
          invoiceDetailVendorName: invoiceDetail.vendorName,
          invoiceDetailComputedTravelerFirstName: invoiceDetail.travelerFirstName,
          invoiceDetailComputedTravelerLastName: invoiceDetail.travelerLastName,
          segmentsComputedFlightInfo: invoiceDetail.flightInfo,
          segmentsComputedFinalDestination: invoiceDetail.finalDestination,
          reconciled: false,
          reconcilePeriod: null,
        }
      }
    )

    const flightReconciliations = []
    for (const flightReconciliationAttributes of flightReconciliationsAttributes) {
      let flightReconciliation = await FlightReconciliation.findOne({
        where: {
          externalTravComIdentifier: flightReconciliationAttributes.externalTravComIdentifier,
        },
      })
      if (isNil(flightReconciliation)) {
        flightReconciliation = await FlightReconciliation.create(flightReconciliationAttributes)
      } else {
        await flightReconciliation.update(flightReconciliationAttributes)
      }
      flightReconciliations.push(flightReconciliation)
    }

    return flightReconciliations
  }

  private buildFilterScopes(): BaseScopeOptions[] {
    const scopes: BaseScopeOptions[] = ["includeAgentNameAttribute"]
    const { filters } = this.query
    if (!isEmpty(filters)) {
      Object.entries(filters).forEach(([key, value]) => {
        scopes.push({ method: [key, value] })
      })
    }

    return scopes
  }

  buildOrder(): ModelOrder[] | undefined {
    const baseOrder: ModelOrder[] = [
      ["segments", "departureInfo", "ASC"],
      ["segments", "arrivalInfo", "ASC"],
    ]

    const { order } = this.query
    if (isNil(order) || isEmpty(order)) {
      return baseOrder
    }

    return [...order, ...baseOrder]
  }

  private buildBookingDate(bookingDate: string | null): Date | null {
    if (isNil(bookingDate) || isEmpty(bookingDate)) return null

    const bookingDateTimeUTC = DateTime.fromFormat(bookingDate, "yyyy-MM-dd HH:mm:ss.SSS", {
      zone: "utc",
    })
    return bookingDateTimeUTC.toJSDate()
  }
}

export default SyncService
