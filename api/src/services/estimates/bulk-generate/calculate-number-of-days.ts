import { max } from "lodash"

export function calculateNumberOfDays(arrivalAt: Date, departureAt: Date): number {
  const differenceInMs = departureAt.getTime() - arrivalAt.getTime()
  const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
  const differenceInDays = Math.ceil(differenceInDaysAsFloat)

  return max([0, differenceInDays]) as number
}

export default calculateNumberOfDays
