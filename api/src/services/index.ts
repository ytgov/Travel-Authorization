export { AuditService } from "./audit-service"
export { DistanceMatrixService } from "./distance-matrix-service"
export { ExpensesService } from "./expenses-service"
export { FormService } from "./form-service"
export { StopsService } from "./stops-service"
export { YkGovernmentDirectorySyncService } from "./yk-government-directory-sync-service"

// Namespaced services
import * as Estimates from "./estimates"
import * as Qa from "./qa"
import * as TravelAuthorizations from "./travel-authorizations"
import * as TravelSegments from "./travel-segments"
import * as Stops from "./stops"

export { Estimates, Qa, TravelAuthorizations, TravelSegments, Stops }

// TODO: move these to their own files, or deprecate and remove them completely
export interface QueryStatement {
  field: string
  operator: string
  value: any
}

export interface SortStatement {
  field: string
  direction: SortDirection
}

export enum SortDirection {
  ASCENDING = "asc",
  DESCENDING = "desc",
}
