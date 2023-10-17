export * from "./audit-service"
export * from "./distance-matrix-service"
export * from "./expenses-service"
export * from "./form-service"
export * from "./travel-authorizations-service"
export * from "./lookup-service"
export * from "./stops-service"
export * from "./user-service"

// Namespaced services
import * as Estimates from "./estimates"

export { Estimates }

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
