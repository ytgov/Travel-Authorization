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

  async perform(): Promise<void> {
    const scopes = this.buildFilterScopes()
    const scopedAccountsReceivableInvoiceDetails = AccountsReceivableInvoiceDetail.scope(scopes)

    const { where } = this.query
    const order = this.buildOrder()
    await scopedAccountsReceivableInvoiceDetails.findEach(
      {
        where,
        order,
        include: [
          "invoice",
          {
            association: "segments",
            include: ["arrivalCity"],
          },
        ],
      },
      async (accountsReceivableInvoiceDetail) => {
        const serializedInvoiceDetail = AccountsReceivableInvoiceDetails.IndexSerializer.perform(
          accountsReceivableInvoiceDetail
        )

        const { invoice } = serializedInvoiceDetail
        const invoiceBookingDate = this.buildBookingDate(invoice.bookingDate)

        const flightReconciliationAttributes = {
          reconcilerId: this.currentUser.id,
          externalTravComIdentifier: serializedInvoiceDetail.id,
          invoiceBookingDate,
          invoiceDepartment: invoice.department,
          invoiceDetailSellingFare: serializedInvoiceDetail.sellingFare,
          invoiceDetailComputedAgentName: serializedInvoiceDetail.agentName,
          invoiceDetailVendorName: serializedInvoiceDetail.vendorName,
          invoiceDetailComputedTravelerFirstName: serializedInvoiceDetail.travelerFirstName,
          invoiceDetailComputedTravelerLastName: serializedInvoiceDetail.travelerLastName,
          segmentsComputedFlightInfo: serializedInvoiceDetail.flightInfo,
          segmentsComputedFinalDestination: serializedInvoiceDetail.finalDestination,
          reconciled: false,
          reconcilePeriod: null,
        }

        const flightReconciliation = await FlightReconciliation.findOne({
          where: {
            externalTravComIdentifier: flightReconciliationAttributes.externalTravComIdentifier,
          },
        })
        if (isNil(flightReconciliation)) {
          await FlightReconciliation.create(flightReconciliationAttributes)
        } else {
          await flightReconciliation.update(flightReconciliationAttributes)
        }
      }
    )

    return
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
