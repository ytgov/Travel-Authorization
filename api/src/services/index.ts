export * from "./audit-service"
export * from "./distance-matrix-service"
export * from "./expenses-service"
export * from "./form-service"
export * from "./stops-service"
export * from "./yk-government-directory-sync-service"

// Namespaced services
import * as Estimates from "./estimates"
import * as Qa from "./qa"
import * as TravelAuthorizations from "./travel-authorizations"
import * as TravelSegments from "./travel-segments"

export { Estimates, Qa, TravelAuthorizations, TravelSegments }

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

export default undefined
