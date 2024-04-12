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
import TravelAuthorizationPreApproval from "./travel-authorization-pre-approval"
import TravelAuthorizationPreApprovalTraveler from "./travel-authorizations-pre-approval-traveler"
import TravelAuthorizationPreApprovalSubmission from "./travel-authorization-pre-approval-submission"
import TravelAuthorizationPreApprovalDocument from "./travel-authorization-pre-approval-document"

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
TravelAuthorizationPreApproval.establishAssociations()
TravelAuthorizationPreApprovalTraveler.establishAssociations()
TravelAuthorizationPreApprovalSubmission.establishAssociations()
TravelAuthorizationPreApprovalDocument.establishAssociations()

// Alphabetically - order does not matter
export { DistanceMatrix } from "./distance-matrix"
export { Location } from "./location"
export { PerDiem } from "./per-diem"
export { TravelPurpose } from "./travel-purpose"
export {
  Expense,
  GeneralLedgerCoding,
  Stop,
  TravelAuthorization,
  TravelAuthorizationActionLog,
  TravelAuthorizationPreApproval,
  TravelAuthorizationPreApprovalSubmission,
  TravelAuthorizationPreApprovalDocument,
  TravelAuthorizationPreApprovalTraveler,
  TravelDeskPassengerNameRecordDocument,
  TravelDeskTravelRequest,
  TravelSegment,
  User,
}

// special db instance that has access to all models.
export default db
