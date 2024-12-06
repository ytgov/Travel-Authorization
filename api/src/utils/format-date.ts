import { isEmpty, isNil } from "lodash"
import { DateTime } from "luxon"

function formatDate(date: Date, format = "MMM d yyyy") {
  if (isNil(date) || isEmpty(date)) {
    return ""
  }

  const datetime = DateTime.fromJSDate(date)
  if (datetime.isValid) {
    return datetime.toFormat(format)
  }

  return ""
}

export default formatDate
