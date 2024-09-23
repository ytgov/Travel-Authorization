import { isNil, isUndefined, isEmpty } from "lodash"
import { isMobilePhone } from "validator"

export const isPhoneNumber = (value) => {
  if (isNil(value) || isUndefined(value) || isEmpty(value)) {
    return true
  }

  const valueWithoutDashes = value.replace(/-/g, "")
  return isMobilePhone(valueWithoutDashes) || "Invalid phone number"
}

export default isPhoneNumber
