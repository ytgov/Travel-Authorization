import db from "../db/db-client"

import Stop from "./stop"

Stop.establishAssociations()

export * from "./auth"
export * from "./destination"
export * from "./expense"
export * from "./form"
export * from "./preapproved-traveler"
export * from "./preapproved"
export * from "./stop"
export * from "./travel-purpose"
export * from "./user"

// special db instance that has access to all models.
export default db
