export * from "./audit-service"
export * from "./distance-matrix-service"
export * from "./estimates-service"
export * from "./expenses-service"
export * from "./form-service"
export * from "./forms-service"
export * from "./lookup-service"
export * from "./stops-service"
export * from "./user-service"

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
