import { omitBy } from "lodash"

/**
 * Parses car rental information from the cars section.
 *
 * @param {string} lines - The lines from the cars section.
 * @returns {Array<Object>} An array of car rental objects.
 *
 * Handles both Unix and Windows line endings.
 *
 * NOTE: This function is currently not in use.
 * It was generated by a best effort conversion from legacy code to a more readable format.
 */
export function parseTravelportalCars(lines) {
  const cars = []
  let currentCar = {}

  lines.split(/\r?\n/).forEach((line) => {
    const isEmptyLine = line.trim() === ""
    if (isEmptyLine) return

    const confirmationMatch = line.match(/^Confirmation Number:\s*(.+)$/)
    if (confirmationMatch) {
      currentCar.confirmationNumber = confirmationMatch[1].trim()
      return
    }

    const pickupMatch = line.match(/^Pickup Time:\s*(.+)$/)
    if (pickupMatch) {
      currentCar.pickupTime = pickupMatch[1].trim()
      return
    }

    const locationMatch = line.match(/^Location:\s*(.+)$/)
    if (locationMatch) {
      currentCar.location = locationMatch[1].trim()
      return
    }

    const vendorMatch = line.match(/^Vendor:\s*(.+)$/)
    if (vendorMatch) {
      currentCar.vendor = vendorMatch[1].trim()
      return
    }

    const dropoffMatch = line.match(/^Drop Off Time:\s*(.+)$/)
    if (dropoffMatch) {
      currentCar.dropoffTime = dropoffMatch[1].trim()
      return
    }

    const carTypeMatch = line.match(/^Car Type:\s*(.+)$/)
    if (carTypeMatch) {
      currentCar.carType = carTypeMatch[1].trim()
      return
    }

    const costMatch = line.match(/^Approximate Cost:\s*([A-Z]{3})\s+(\d+\.\d{2})$/)
    if (costMatch) {
      const [, currency, cost] = costMatch
      currentCar.currency = currency.trim()
      currentCar.cost = cost.trim()
      return
    }
  })

  // Push the last car if exists
  if (Object.keys(currentCar).length > 0) {
    cars.push(currentCar)
  }

  const cleanedCars = cars.map((car) => omitBy(car, (value) => value === ""))
  return cleanedCars
}

export default parseTravelportalCars
