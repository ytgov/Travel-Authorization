/**
 * Parses a human-readable date string into a Date object.
 *
 * @param {string} date - The input date string.
 * @returns {Date} The parsed Date object.
 */
export function parseHumanizedDate(date) {
  const today = new Date()
  let fullDate = new Date()

  const fullDateRegex = /^(\d{1,2})(\/|\s|-)([A-Za-z]{2,3})(,?)(\/|\s|-)(\d{2}|\d{4})$/
  const partialDateDayFirstRegex = /^(\d{1,2})(\/|\s|-)([A-Za-z]{3})$/
  const partialDateMonthFirstRegex = /^([A-Za-z]{3})(\/|\s|-)(\d{1,2})$/

  if (fullDateRegex.test(date)) {
    fullDate = new Date(date)
  } else if (partialDateDayFirstRegex.test(date) || partialDateMonthFirstRegex.test(date)) {
    // Append the current year to partial dates
    fullDate = new Date(`${date} ${today.getFullYear()}`)

    // If the parsed date is in the past, assume it's for the next year
    if (fullDate < today) {
      fullDate = new Date(`${date} ${today.getFullYear() + 1}`)
    }
  }

  return fullDate
}

export default parseHumanizedDate
