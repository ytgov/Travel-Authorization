import { max } from "lodash"

export function calculateNumberOfNights(arrivalAt: Date, departureAt: Date): number {
  const differenceInMs = departureAt.getTime() - arrivalAt.getTime()
  const differenceInDaysAsFloat = differenceInMs / (1000 * 3600 * 24)
  const differenceInNights = Math.floor(differenceInDaysAsFloat)

  return max([0, differenceInNights]) as number
}

export default calculateNumberOfNights
