import db from "@/db/db-client"

import Stop from "./stop"
import Expense from "./expense"
import GeneralLedgerCoding from "./general-ledger-coding"
import TravelAuthorization from "./travel-authorization"
import TravelAuthorizationActionLog from "./travel-authorization-action-log"
import TravelDeskPassengerNameRecordDocument from "./travel-desk-passenger-name-record-document"
import TravelDeskTravelRequest from "./travel-desk-travel-request"
import User from "./user"
import TravelSegment from "./travel-segment"

// Order matters here, though may be somewhat flexible
Stop.establishAssociations()
Expense.establishAssociations()
TravelAuthorization.establishAssociations()
TravelDeskPassengerNameRecordDocument.establishAssociations()
TravelDeskTravelRequest.establishAssociations()
User.establishAssociations()
TravelAuthorizationActionLog.establishAssociations()
TravelSegment.establishAssociations()
GeneralLedgerCoding.establishAssociations()

// Alphabetically - order does not matter
export { DistanceMatrix } from "./distance-matrix"
export { Location } from "./location"
export { PerDiem } from "./per-diem"
export { Preapproved } from "./preapproved"
export { PreapprovedTraveler } from "./preapproved-traveler"
export { TravelPurpose } from "./travel-purpose"
export {
  Expense,
  GeneralLedgerCoding,
  Stop,
  TravelAuthorization,
  TravelAuthorizationActionLog,
  TravelDeskPassengerNameRecordDocument,
  TravelDeskTravelRequest,
  TravelSegment,
  User,
}

// special db instance that has access to all models.
export default db
