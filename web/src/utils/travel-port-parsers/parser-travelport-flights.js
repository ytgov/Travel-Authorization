import { omitBy } from "lodash"

/**
 * Parses flight information from the flights section.
 *
 * @param {string} lines - The lines from the flights section
 * @returns {Array<Object>} An array of flight objects.
 *
 * Handles both Unix and Windows line endings
 */
export function parseTravelportFlights(lines) {
  const flights = []
  let currentFlight = {}

  lines.split(/\r?\n/).forEach((line) => {
    const isEmptyLine = line.trim() === ""
    if (isEmptyLine) return

    // Check if the line starts a new flight entry
    const flightHeaderMatch = line.match(/^([A-Za-z\s]+)\s+([A-Za-z0-9]+)$/)
    if (flightHeaderMatch) {
      // If there's an existing flight being built, push it to the flights array
      if (Object.keys(currentFlight).length > 0) {
        flights.push(currentFlight)
        currentFlight = {}
      }
      const [, airline, flightNumber] = flightHeaderMatch
      currentFlight.airline = airline.trim()
      currentFlight.flightNumber = flightNumber.trim()
      return
    }

    // Parse other flight details
    const departureMatch = line.match(
      /^Departure:\s*(\d+\s+\w+)\s+(\d{2}:\d{2})\s+(.+?)\s+\((\w{3})\)\s+Terminal:\s*(\w*)$/
    )
    if (departureMatch) {
      const [
        ,
        departureDate,
        departureTime,
        departureAirport,
        departureAirportCode,
        departureTerminal,
      ] = departureMatch
      currentFlight.departureDate = departureDate.trim()
      currentFlight.departureTime = departureTime.trim()
      currentFlight.departureAirport = departureAirport.trim()
      currentFlight.departureAirportCode = departureAirportCode.trim()
      currentFlight.departureTerminal = departureTerminal.trim()
      return
    }

    const arrivalMatch = line.match(
      /^Arrival:\s*(\d+\s+\w+)\s+(\d{2}:\d{2})\s+(.+?)\s+\((\w{3})\)\s+Terminal:\s*(\w*)$/
    )
    if (arrivalMatch) {
      const [, arrivalDate, arrivalTime, arrivalAirport, arrivalAirportCode, arrivalTerminal] =
        arrivalMatch
      currentFlight.arrivalDate = arrivalDate.trim()
      currentFlight.arrivalTime = arrivalTime.trim()
      currentFlight.arrivalAirport = arrivalAirport.trim()
      currentFlight.arrivalAirportCode = arrivalAirportCode.trim()
      currentFlight.arrivalTerminal = arrivalTerminal.trim()
      return
    }

    const durationMatch = line.match(/^Duration:\s*(\d+\s+Hour\(s\)\s+\d+\s+Minutes)$/)
    if (durationMatch) {
      currentFlight.duration = durationMatch[1].trim()
      return
    }

    const statusMatch = line.match(/^Status:\s*(.+)$/)
    if (statusMatch) {
      currentFlight.status = statusMatch[1].trim()
      return
    }

    const classMatch = line.match(/^Class:\s*([A-Za-z]+)$/)
    if (classMatch) {
      currentFlight.class = classMatch[1].trim()
      return
    }
  })

  // Push the last flight if exists
  if (Object.keys(currentFlight).length > 0) {
    flights.push(currentFlight)
  }

  const cleanedFlights = flights.map((flight) => omitBy(flight, (value) => value === ""))
  return cleanedFlights
}

export default parseTravelportFlights
