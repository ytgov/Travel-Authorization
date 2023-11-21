import db from "@/db/db-client"

import Stop from "./stop"
import Expense from "./expense"
import TravelAuthorization from "./travel-authorization"
import TravelAuthorizationActionLog from "./travel-authorization-action-log"
import TravelDeskPassengerNameRecordDocument from "./travel-desk-passenger-name-record-document"
import TravelDeskTravelRequest from "./travel-desk-travel-request"
import User from "./user"

// Order matters here, though may be somewhat flexible
Stop.establishAssociations()
Expense.establishAssociations()
TravelAuthorization.establishAssociations()
TravelDeskPassengerNameRecordDocument.establishAssociations()
TravelDeskTravelRequest.establishAssociations()
User.establishAssociations()
TravelAuthorizationActionLog.establishAssociations()

// Alphabetically - order does not matter
export * from "./distance-matrix"
export * from "./expense"
export * from "./location"
export * from "./per-diem"
export * from "./preapproved-traveler"
export * from "./preapproved"
export * from "./stop"
export * from "./travel-authorization"
export * from "./travel-authorization-action-log"
export * from "./travel-desk-passenger-name-record-document"
export * from "./travel-desk-travel-agent"
export * from "./travel-desk-travel-request"
export * from "./travel-purpose"
export * from "./user"

// special db instance that has access to all models.
export default db
