import { clone, max } from "lodash"

// This calculates the number of days you would need to request per-diems for
// as a result the function can't use the time difference alone
export function calculateNumberOfDays(arrivalAt: Date, departureAt: Date): number {
  const arrivalAtStartOfDay = clone(arrivalAt)
  arrivalAtStartOfDay.setHours(0, 0, 0, 0)
  const departureAtEndOfDay = clone(departureAt)
  departureAtEndOfDay.setHours(23, 59, 59, 999)

  const differenceInMs = departureAtEndOfDay.getTime() - arrivalAtStartOfDay.getTime()
  const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
  const differenceInDays = Math.ceil(differenceInDaysAsFloat)

  return max([0, differenceInDays]) as number
}

export default calculateNumberOfDays
