import db from "@/db/db-client"

import Stop from "./stop"
import Expense from "./expense"
import TravelAuthorization from "./travel-authorization"

Stop.establishAssociations()
Expense.establishAssociations()
TravelAuthorization.establishAssociations()

export * from "./auth"
export * from "./distance-matrix"
export * from "./expense"
export * from "./travel-authorization"
export * from "./location"
export * from "./per-diem"
export * from "./preapproved-traveler"
export * from "./preapproved"
export * from "./stop"
export * from "./travel-purpose"
export * from "./user"

// special db instance that has access to all models.
export default db
