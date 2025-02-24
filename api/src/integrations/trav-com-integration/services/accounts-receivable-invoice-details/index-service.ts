import { Attributes, FindOptions, ModelStatic } from "sequelize"

import BaseService from "@/services/base-service"
import { FlightReconciliation } from "@/models"
import { AccountsReceivableInvoiceDetail } from "@/integrations/trav-com-integration/models"
import { keyBy } from "lodash"

export type AccountsReceivableInvoiceDetailsFindOptions = FindOptions<
  Attributes<AccountsReceivableInvoiceDetail>
>

export type AccountsReceivableInvoiceDetailWithFlightReconciliation =
  AccountsReceivableInvoiceDetail & {
    flightReconciliation?: FlightReconciliation
  }

export class IndexService extends BaseService {
  constructor(
    private scopedAccountsReceivableInvoiceDetails: ModelStatic<AccountsReceivableInvoiceDetail>,
    private findOptions: AccountsReceivableInvoiceDetailsFindOptions = {}
  ) {
    super()
  }

  async perform(): Promise<AccountsReceivableInvoiceDetailWithFlightReconciliation[]> {
    const accountsReceivableInvoiceDetails =
      await this.scopedAccountsReceivableInvoiceDetails.findAll(this.findOptions)
    const accountsReceivableInvoiceDetailIds = accountsReceivableInvoiceDetails.map(
      (accountReceivableInvoiceDetail) => accountReceivableInvoiceDetail.id
    )
    const flightReconciliations = await FlightReconciliation.findAll({
      where: {
        externalTravComIdentifier: accountsReceivableInvoiceDetailIds,
      },
    })
    const flightReconciliationsByExternalTravComIdentifier = keyBy(
      flightReconciliations,
      "externalTravComIdentifier"
    )

    for (const accountReceivableInvoiceDetail of accountsReceivableInvoiceDetails) {
      accountReceivableInvoiceDetail.flightReconciliation =
        flightReconciliationsByExternalTravComIdentifier[accountReceivableInvoiceDetail.id] ?? null
    }

    return accountsReceivableInvoiceDetails
  }
}

export default IndexService
