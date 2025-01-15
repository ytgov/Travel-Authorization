import { DateTime } from "luxon"

/**
 * Parses a human-readable date string into a Date object.
 *
 * @param {string} dateString - The input date string.
 * @returns {Date} The parsed Date object.
 */
export function parseHumanizedDate(dateString) {
  const cleanDateString = dateString.replace(/[,/-]/g, " ").replace(/\s+/g, " ").trim()

  const dateWithYearFormats = [
    "d MMM yy", // 3 Jan 21
    "d MMM yyyy", // 3 Jan 2021
    "dd MMM yy", // 03 Jan 21
    "dd MMM yyyy", // 03 Jan 2021
  ]

  for (const format of dateWithYearFormats) {
    const parsedDate = DateTime.fromFormat(cleanDateString, format)
    if (parsedDate.isValid) {
      return parsedDate.toJSDate()
    }
  }

  const dateWithNoYearFormats = [
    "d MMM", // 3 Jan
    "dd MMM", // 03 Jan
    "MMM d", // Jan 3
    "MMM dd", // Jan 03
  ]
  const currentDate = DateTime.local()

  for (const format of dateWithNoYearFormats) {
    const parsedDate = DateTime.fromFormat(cleanDateString, format)
    if (parsedDate.isValid) {
      const isDateInThePast = parsedDate < currentDate
      if (isDateInThePast) {
        return parsedDate.plus({ year: 1 }).toJSDate()
      }
      return parsedDate.toJSDate()
    }
  }

  return null
}

export default parseHumanizedDate
