// This calculates the number of days you would need to request per-diems for
// as a result the function can't use the time difference alone
export function calculateNumberOfDays(arrivalAt: Date, departureAt: Date): number {
  if (arrivalAt.getTime() > departureAt.getTime()) {
    throw new Error("arrivalAt must be less than or equal to departureAt")
  }

  const arrivalAtStartOfDay = new Date(arrivalAt)
  arrivalAtStartOfDay.setHours(0, 0, 0, 0)
  const departureAtEndOfDay = new Date(departureAt)
  departureAtEndOfDay.setHours(23, 59, 59, 999)

  const differenceInMs = departureAtEndOfDay.getTime() - arrivalAtStartOfDay.getTime()
  const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
  const differenceInDays = Math.ceil(differenceInDaysAsFloat)

  return differenceInDays
}

export default calculateNumberOfDays
