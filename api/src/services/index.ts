export { AuditService } from "./audit-service"
export { DistanceMatrixService } from "./distance-matrix-service"
export { ExpensesService } from "./expenses-service"
export { FormService } from "./form-service"
export { StopsService } from "./stops-service"
export { YkGovernmentDirectorySyncService } from "./yk-government-directory-sync-service"

// Namespaced services
export * as Estimates from "./estimates"
export * as GeneralLedgerCodings from "./general-ledger-codings"
export * as PerDiems from "./per-diems"
export * as Qa from "./qa"
export * as Stops from "./stops"
export * as TravelAllowances from "./travel-allowances"
export * as TravelAuthorizations from "./travel-authorizations"
export * as TravelDeskFlightRequests from "./travel-desk-flight-requests"
export * as TravelDeskTravelAgencies from "./travel-desk-travel-agencies"
export * as TravelDeskTravelRequests from "./travel-desk-travel-requests"
export * as TravelSegments from "./travel-segments"
export * as Users from "./users"

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
