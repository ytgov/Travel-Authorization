import { clone, max } from "lodash"

// This calculates the number of nights you would need to book a hotel for
// as a result the function can't use the time difference alone
export function calculateNumberOfNights(arrivalAt: Date, departureAt: Date): number {
  const arrivalAtStartOfDay = clone(arrivalAt)
  arrivalAtStartOfDay.setHours(0, 0, 0, 0)
  const departureAtStartOfDay = clone(departureAt)
  departureAtStartOfDay.setHours(0, 0, 0, 0)

  const differenceInMs = departureAtStartOfDay.getTime() - arrivalAtStartOfDay.getTime()
  const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
  const differenceInNights = Math.floor(differenceInDaysAsFloat)

  return max([0, differenceInNights]) as number
}

export default calculateNumberOfNights
