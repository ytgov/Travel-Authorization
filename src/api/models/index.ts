import db from "../db/db-client"

import Stop from "./stop"
import Expense from "./expense"
import Form from "./form"

Stop.establishAssociations()
Expense.establishAssociations()
Form.establishAssociations()

export * from "./auth"
export * from "./destination"
export * from "./distance-matrix"
export * from "./expense"
export * from "./form"
export * from "./preapproved-traveler"
export * from "./preapproved"
export * from "./stop"
export * from "./travel-purpose"
export * from "./user"

// special db instance that has access to all models.
export default db
