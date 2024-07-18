import db from "@/db/db-client"

import Expense from "./expense"
import GeneralLedgerCoding from "./general-ledger-coding"
import Stop from "./stop"
import TravelAuthorization from "./travel-authorization"
import TravelAuthorizationActionLog from "./travel-authorization-action-log"
import TravelAuthorizationPreApproval from "./travel-authorization-pre-approval"
import TravelAuthorizationPreApprovalDocument from "./travel-authorization-pre-approval-document"
import TravelAuthorizationPreApprovalProfile from "./travel-authorization-pre-approval-profile"
import TravelAuthorizationPreApprovalSubmission from "./travel-authorization-pre-approval-submission"
import TravelDeskFlightRequest from "./travel-desk-flight-request"
import TravelDeskHotel from "./travel-desk-hotel"
import TravelDeskOtherTransportation from "./travel-desk-other-transportation"
import TravelDeskPassengerNameRecordDocument from "./travel-desk-passenger-name-record-document"
import TravelDeskQuestion from "./travel-desk-question"
import TravelDeskRentalCar from "./travel-desk-rental-car"
import TravelDeskTravelRequest from "./travel-desk-travel-request"
import TravelSegment from "./travel-segment"
import User from "./user"

Expense.establishAssociations()
GeneralLedgerCoding.establishAssociations()
Stop.establishAssociations()
TravelAuthorization.establishAssociations()
TravelAuthorizationActionLog.establishAssociations()
TravelAuthorizationPreApproval.establishAssociations()
TravelAuthorizationPreApprovalDocument.establishAssociations()
TravelAuthorizationPreApprovalProfile.establishAssociations()
TravelAuthorizationPreApprovalSubmission.establishAssociations()
TravelDeskFlightRequest.establishAssociations()
TravelDeskHotel.establishAssociations()
TravelDeskOtherTransportation.establishAssociations()
TravelDeskPassengerNameRecordDocument.establishAssociations()
TravelDeskQuestion.establishAssociations()
TravelDeskRentalCar.establishAssociations()
TravelDeskTravelRequest.establishAssociations()
TravelSegment.establishAssociations()
User.establishAssociations()

export {
  Expense,
  GeneralLedgerCoding,
  Stop,
  TravelAuthorization,
  TravelAuthorizationActionLog,
  TravelAuthorizationPreApproval,
  TravelAuthorizationPreApprovalDocument,
  TravelAuthorizationPreApprovalProfile,
  TravelAuthorizationPreApprovalSubmission,
  TravelDeskFlightRequest,
  TravelDeskHotel,
  TravelDeskOtherTransportation,
  TravelDeskPassengerNameRecordDocument,
  TravelDeskQuestion,
  TravelDeskRentalCar,
  TravelDeskTravelRequest,
  TravelSegment,
  User,
}
export { DistanceMatrix } from "./distance-matrix"
export { Location } from "./location"
export { PerDiem } from "./per-diem"
export { TravelPurpose } from "./travel-purpose"

// special db instance that has access to all models.
export default db
