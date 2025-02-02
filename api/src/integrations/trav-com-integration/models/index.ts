import db from "@/integrations/trav-com-integration/db/db-client"

export { type ArInvoiceNoHealthRaw } from "./ar-invoice"
export { type ArInvoiceDetailNoHealthRaw } from "./ar-invoice-details"
export { type Segment, type SegmentNoHealthRaw } from "./segments"

import ArInvoice from "./ar-invoice"
import ArInvoiceDetail from "./ar-invoice-details"

ArInvoice.establishAssociations()
ArInvoiceDetail.establishAssociations()

export {
  ArInvoice,
  ArInvoiceDetail,
  // add additional models as needed
}

export default db
